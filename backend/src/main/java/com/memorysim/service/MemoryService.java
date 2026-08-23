package com.memorysim.service;

import com.memorysim.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class MemoryService {

    private int totalSize = 0;
    private final List<MemoryBlock> blocks = new ArrayList<>();
    private int lastAllocatedIndex = 0; // used for Next Fit

    public void initialize(int size) {
        if (size <= 0) {
            throw new IllegalArgumentException("Memory size must be positive");
        }
        this.totalSize = size;
        this.lastAllocatedIndex = 0;
        blocks.clear();
        blocks.add(new MemoryBlock(0, size)); // one big free block
    }

    public MemoryStatus allocate(AllocationRequest request) {
        if (totalSize == 0) {
            throw new IllegalStateException("Memory not initialized. Call /init first.");
        }
        if (request.getSize() <= 0) {
            throw new IllegalArgumentException("Process size must be positive");
        }
        if (request.getProcessId() == null || request.getProcessId().isBlank()) {
            throw new IllegalArgumentException("Process ID is required");
        }

        // Check if process already exists
        boolean exists = blocks.stream()
                .anyMatch(b -> request.getProcessId().equals(b.getProcessId()));
        if (exists) {
            throw new IllegalArgumentException("Process ID already allocated: " + request.getProcessId());
        }

        Optional<MemoryBlock> selected = switch (request.getAlgorithm()) {
            case FIRST_FIT -> findFirstFit(request.getSize());
            case BEST_FIT  -> findBestFit(request.getSize());
            case WORST_FIT -> findWorstFit(request.getSize());
            case NEXT_FIT  -> findNextFit(request.getSize());
        };

        if (selected.isEmpty()) {
            throw new IllegalStateException("Not enough contiguous memory for process of size " + request.getSize());
        }

        MemoryBlock freeBlock = selected.get();
        int index = blocks.indexOf(freeBlock);

        // Allocate
        if (freeBlock.getSize() == request.getSize()) {
            freeBlock.setAllocated(true);
            freeBlock.setProcessId(request.getProcessId());
        } else {
            // Split the block
            MemoryBlock allocated = new MemoryBlock(
                    freeBlock.getStartAddress(),
                    request.getSize(),
                    true,
                    request.getProcessId()
            );
            MemoryBlock remaining = new MemoryBlock(
                    freeBlock.getStartAddress() + request.getSize(),
                    freeBlock.getSize() - request.getSize()
            );
            blocks.set(index, allocated);
            blocks.add(index + 1, remaining);
        }

        // Update last allocated index for Next Fit
        lastAllocatedIndex = blocks.indexOf(
                blocks.stream()
                        .filter(b -> request.getProcessId().equals(b.getProcessId()))
                        .findFirst()
                        .orElse(freeBlock)
        );

        return getStatus();
    }

    public MemoryStatus deallocate(String processId) {
        Optional<MemoryBlock> blockOpt = blocks.stream()
                .filter(b -> processId.equals(b.getProcessId()))
                .findFirst();

        if (blockOpt.isEmpty()) {
            throw new IllegalArgumentException("Process not found: " + processId);
        }

        MemoryBlock block = blockOpt.get();
        block.setAllocated(false);
        block.setProcessId(null);

        mergeFreeBlocks();
        return getStatus();
    }

    public MemoryStatus reset() {
        if (totalSize > 0) {
            initialize(totalSize);
        }
        return getStatus();
    }
    public MemoryStatus defragment() {
    if (totalSize == 0) {
        throw new IllegalStateException("Memory not initialized");
    }

    // Collect all allocated blocks
    List<MemoryBlock> allocated = new ArrayList<>();
    for (MemoryBlock block : blocks) {
        if (block.isAllocated()) {
            allocated.add(block);
        }
    }

    // Rebuild memory: all allocated blocks first, then one big free block
    blocks.clear();
    int currentAddress = 0;

    for (MemoryBlock block : allocated) {
        MemoryBlock newBlock = new MemoryBlock(
                currentAddress,
                block.getSize(),
                true,
                block.getProcessId()
        );
        blocks.add(newBlock);
        currentAddress += block.getSize();
    }

    // Remaining free space
    int remaining = totalSize - currentAddress;
    if (remaining > 0) {
        blocks.add(new MemoryBlock(currentAddress, remaining));
    }

    lastAllocatedIndex = 0;
    return getStatus();
    }

    public MemoryStatus getStatus() {
        int used = blocks.stream()
                .filter(MemoryBlock::isAllocated)
                .mapToInt(MemoryBlock::getSize)
                .sum();

        int free = totalSize - used;
        int externalFrag = calculateExternalFragmentation();

        return new MemoryStatus(totalSize, used, free, externalFrag, new ArrayList<>(blocks));
    }

    // -------------------- Algorithms --------------------

    private Optional<MemoryBlock> findFirstFit(int size) {
        return blocks.stream()
                .filter(b -> !b.isAllocated() && b.getSize() >= size)
                .findFirst();
    }

    private Optional<MemoryBlock> findBestFit(int size) {
        return blocks.stream()
                .filter(b -> !b.isAllocated() && b.getSize() >= size)
                .min(Comparator.comparingInt(MemoryBlock::getSize));
    }

    private Optional<MemoryBlock> findWorstFit(int size) {
        return blocks.stream()
                .filter(b -> !b.isAllocated() && b.getSize() >= size)
                .max(Comparator.comparingInt(MemoryBlock::getSize));
    }

    private Optional<MemoryBlock> findNextFit(int size) {
        int n = blocks.size();
        if (n == 0) return Optional.empty();

        // Start searching from lastAllocatedIndex
        for (int i = 0; i < n; i++) {
            int index = (lastAllocatedIndex + i) % n;
            MemoryBlock block = blocks.get(index);
            if (!block.isAllocated() && block.getSize() >= size) {
                return Optional.of(block);
            }
        }
        return Optional.empty();
    }

    // -------------------- Helpers --------------------

    private void mergeFreeBlocks() {
        if (blocks.isEmpty()) return;

        List<MemoryBlock> merged = new ArrayList<>();
        MemoryBlock current = blocks.get(0);

        for (int i = 1; i < blocks.size(); i++) {
            MemoryBlock next = blocks.get(i);
            if (!current.isAllocated() && !next.isAllocated()) {
                current.setSize(current.getSize() + next.getSize());
            } else {
                merged.add(current);
                current = next;
            }
        }
        merged.add(current);

        blocks.clear();
        blocks.addAll(merged);

        // Keep lastAllocatedIndex valid
        if (lastAllocatedIndex >= blocks.size()) {
            lastAllocatedIndex = 0;
        }
    }

    private int calculateExternalFragmentation() {
        int largestFree = blocks.stream()
                .filter(b -> !b.isAllocated())
                .mapToInt(MemoryBlock::getSize)
                .max()
                .orElse(0);

        int totalFree = blocks.stream()
                .filter(b -> !b.isAllocated())
                .mapToInt(MemoryBlock::getSize)
                .sum();

        return totalFree - largestFree;
    }
}