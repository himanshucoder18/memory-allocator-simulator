package com.memorysim.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class MemoryStatus {
    private int totalSize;
    private int usedMemory;
    private int freeMemory;
    private int externalFragmentation;
    private List<MemoryBlock> blocks;
}