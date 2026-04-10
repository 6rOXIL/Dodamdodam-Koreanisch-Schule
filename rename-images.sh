#!/bin/bash

# images 폴더 경로
IMAGES_DIR="public/images"

# 프로필 사진 파일명 (이 파일은 profile.jpg로 변경)
PROFILE_FILE="photo.jpg"

# images 폴더로 이동
cd "$(dirname "$0")"

# 프로필 사진이 있으면 profile.jpg로 변경
# if [ -f "$IMAGES_DIR/$PROFILE_FILE" ]; then
#     echo "프로필 사진을 profile.jpg로 변경 중..."
#     mv "$IMAGES_DIR/$PROFILE_FILE" "$IMAGES_DIR/profile.jpg"
#     echo "✓ profile.jpg로 변경 완료"
# fi

# 나머지 이미지 파일들을 photo-1.jpg, photo-2.jpg 형식으로 변경
counter=7

# 각 확장자별로 파일 찾기
for ext in jpg jpeg png JPG JPEG PNG; do
    for file in "$IMAGES_DIR"/*.$ext; do
        # 파일이 존재하고, profile.jpg가 아닌 경우
        if [ -f "$file" ] && [ "$(basename "$file")" != "profile.$ext" ] && [ "$(basename "$file")" != "README.md" ]; then
            extension="${file##*.}"
            new_name="$IMAGES_DIR/photo-$counter.$extension"
            
            # 파일명이 이미 photo-X 형식이 아니면 변경
            filename=$(basename "$file")
            if [[ ! "$filename" =~ ^photo-[0-9]+\. ]]; then
                echo "$filename -> photo-$counter.$extension"
                mv "$file" "$new_name"
                counter=$((counter + 1))
            else
                # 이미 photo-X 형식이면 카운터만 증가
                counter=$((counter + 1))
            fi
        fi
    done
done

echo ""
echo "파일명 변경 완료!"
echo "프로필 사진: profile.jpg"
echo "포트폴리오 사진: photo-1.$extension ~ photo-$((counter-1)).$extension"
