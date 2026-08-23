package com.memorysim.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemoryBlock {
    private int startAddress;
    private int size;
    private boolean allocated;
    private String processId;   // null if free

    public MemoryBlock(int startAddress, int size) {
        this.startAddress = startAddress;
        this.size = size;
        this.allocated = false;
        this.processId = null;
    }
}