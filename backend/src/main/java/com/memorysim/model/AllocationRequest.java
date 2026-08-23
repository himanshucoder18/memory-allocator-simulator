package com.memorysim.model;

import lombok.Data;

@Data
public class AllocationRequest {
    private String processId;
    private int size;
    private AlgorithmType algorithm;
}