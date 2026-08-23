package com.memorysim.controller;

import com.memorysim.model.*;
import com.memorysim.service.MemoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memory")
@CrossOrigin(origins = "*")   // temporary – we will tighten this later
public class MemoryController {

    private final MemoryService memoryService;

    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @PostMapping("/init")
    public ResponseEntity<MemoryStatus> init(@RequestParam int size) {
        memoryService.initialize(size);
        return ResponseEntity.ok(memoryService.getStatus());
    }

    @PostMapping("/allocate")
    public ResponseEntity<MemoryStatus> allocate(@RequestBody AllocationRequest request) {
        return ResponseEntity.ok(memoryService.allocate(request));
    }

    @PostMapping("/deallocate")
    public ResponseEntity<MemoryStatus> deallocate(@RequestParam String processId) {
        return ResponseEntity.ok(memoryService.deallocate(processId));
    }

    @PostMapping("/reset")
    public ResponseEntity<MemoryStatus> reset() {
        return ResponseEntity.ok(memoryService.reset());
    }
    @PostMapping("/defragment")
    public ResponseEntity<MemoryStatus> defragment() {
    return ResponseEntity.ok(memoryService.defragment());
    }

    @GetMapping("/status")
    public ResponseEntity<MemoryStatus> status() {
        return ResponseEntity.ok(memoryService.getStatus());
    }
}