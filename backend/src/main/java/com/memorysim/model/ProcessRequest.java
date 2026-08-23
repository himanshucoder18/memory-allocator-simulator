package com.memorysim.model;

import lombok.Data;

@Data
public class ProcessRequest {
    private String processId;
    private int size;
}