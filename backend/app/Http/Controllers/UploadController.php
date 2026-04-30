<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120', // Max 5MB
            'folder' => 'required|string',
            'subfolder' => 'nullable|string'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $folder = Str::slug($request->input('folder', 'misc'));
            $subfolder = $request->input('subfolder');
            
            $targetDir = 'uploads/' . $folder;
            if ($subfolder) {
                // Keep subfolder slugged but allow multiple levels if needed
                $targetDir .= '/' . Str::slug($subfolder);
            }
            
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path($targetDir), $filename);

            $url = '/' . $targetDir . '/' . $filename;

            return response()->json([
                'url' => $url,
                'path' => $url,
            ]);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

    public function delete(Request $request)
    {
        $path = $request->input('path');
        if (!$path) return response()->json(['message' => 'Path required'], 400);

        // Remove leading slash
        $path = ltrim($path, '/');

        // Security check: only delete from uploads folder
        if (!Str::startsWith($path, 'uploads/')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $fullPath = public_path($path);

        if (file_exists($fullPath)) {
            unlink($fullPath);
            return response()->json(['message' => 'File deleted']);
        }

        return response()->json(['message' => 'File not found'], 404);
    }

    public function view(Request $request)
    {
        $path = $request->query('path');
        
        // Remove leading slash if exists
        $path = ltrim($path, '/');
        
        // Ensure the path is within the uploads directory for security
        if (!Str::startsWith($path, 'uploads/')) {
            abort(403, 'Unauthorized access');
        }

        $fullPath = public_path($path);

        if (!file_exists($fullPath)) {
            abort(404, 'File not found');
        }

        $mimeType = mime_content_type($fullPath);
        
        return response()->file($fullPath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . basename($fullPath) . '"'
        ]);
    }
}
