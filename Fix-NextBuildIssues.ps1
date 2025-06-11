# Fix-NextBuildIssues.ps1
Write-Host "`n=== Memulai pemeriksaan dan perbaikan masalah build Next.js ==="

# 1. Cek <img> HTML tag yang tidak pakai next/image
Write-Host "`n[1] Mengecek penggunaan tag <img> di project..."
Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx | 
    Select-String -Pattern '<img\s' | 
    ForEach-Object {
        Write-Host "  -> Ditemukan di file $($_.Path), baris $($_.LineNumber)"
    }

# 2. Cek karakter tanda kutip yang tidak di-escape
Write-Host "`n[2] Mengecek tanda kutip tidak di-escape..."
Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx | 
    Select-String -Pattern '[^&](?<!&)(["])(?=\w)' | 
    ForEach-Object {
        Write-Host "  -> Unescaped quote di $($_.Path), baris $($_.LineNumber)"
    }

# 3. Cek useEffect tanpa dependensi
Write-Host "`n[3] Mengecek useEffect tanpa array dependency..."
Get-ChildItem -Recurse -Include *.js,*.jsx | 
    Select-String -Pattern 'useEffect\(([^)]*)\)' | 
    ForEach-Object {
        if ($_.Line -notmatch '\[.*\]') {
            Write-Host "  -> Periksa useEffect di $($_.Path), baris $($_.LineNumber)"
        }
    }

# 4. Cek tag <script> sinkron
Write-Host "`n[4] Mengecek penggunaan <script> sinkron..."
Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx,*.html | 
    Select-String -Pattern '<script\s+[^>]*src=[^>]*>' | 
    ForEach-Object {
        Write-Host "  -> Tag <script> sinkron di $($_.Path), baris $($_.LineNumber)"
    }

# 5. Cek <link rel="stylesheet">
Write-Host "`n[5] Mengecek penggunaan <link rel=""stylesheet"">..."
Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx,*.html | 
    Select-String -Pattern '<link\s+[^>]*rel=["'']stylesheet["'']' | 
    ForEach-Object {
        Write-Host "  -> Tag stylesheet manual di $($_.Path), baris $($_.LineNumber)"
    }

Write-Host "`n=== Pemeriksaan selesai. Silakan tinjau dan perbaiki file yang terdeteksi. ==="
