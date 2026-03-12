package com.intech.dukaantech.inventory.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private final String uploadDir = "uploads/";

    @Override
    public String uploadFile(MultipartFile file) {

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            File dest = new File(uploadDir + fileName);

            file.transferTo(dest);

            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("File upload failed");
        }
    }

    @Override
    public boolean deleteFile(String fileName) {

        File file = new File(uploadDir + fileName);

        return file.exists() && file.delete();
    }
}