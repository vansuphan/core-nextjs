# Diginext Framework
This is a [Next.js](https://nextjs.org/) framework created by [Digitop](https://www.digitop.vn)

## [CHANGELOG.md](CHANGELOG.md)

---

Author: Boss Duy Nguyen <duynguyen@wearetopgroup.com>

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Or [https://localhost:3443](https://localhost:3443) to use self-signed HTTPS.

---

## Hướng dẫn develop:

1. Clone repo về máy cá nhân.
2. Tách nhánh `master` về máy của mình: `dev-myname`
3. Develop tính năng mới.
4. Khi đã develop xong: 
- Tag version mới: `git tag {version-mới}`
- Push tag version lên repo: `git push --follow-tags`
5. Chuẩn bị pull request: 
- Tăng version trong `package.json` và `readme.json`
- Cập nhật `README.md` nếu có
6. Tạo pull request vào `master`.

---

## How to build Docker Image

Use this command to build docker image (with the same version in `package.json`) and push to Docker Hub:

```
VERSION="1.3.7" && IMAGE_NAME="digitop/diginext" && docker build -t $IMAGE_NAME":latest" -t "$IMAGE_NAME:$VERSION" -f deployment/build.Dockerfile . && docker push "$IMAGE_NAME:$VERSION" && docker push $IMAGE_NAME":latest"
```

(Kiểm tra lại ở link này nếu cần: https://hub.docker.com/r/digitop/diginext/tags)

---

## TODO:

- Develop more components
- Develop more plugins