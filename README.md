# my-arg-game

江川大学（JIANGCHUAN UNIVERSITY）官网 —— ARG 交互叙事静态站点。

> 自动上传的项目，上传日期：2026-09-07，上传分支：`auto-upload-20260907-2154`。
> 敏感信息已从仓库中移除，请在平台 secrets 中配置必要的环境变量。

## 项目类型

纯静态 HTML 站点，无构建步骤、无依赖。直接用任意静态服务器打开根目录 `index.html` 即可，或启用 GitHub Pages。

## 目录结构

```
.
├── index.html              主站首页
├── sitemap.html            网站地图
├── coming-soon.html        分院占位页
├── common.css / common.js / components.js / header.html / footer.html
│                           全站公共样式、脚本与页眉页脚片段
├── about/                  关于江川（6 页）
├── admissions/ alumni/ campus-life/ contact/ current-students/
├── event/ faculties/ global/ intra/ knowledge-exchange/ library/
├── news/ prospective-students/ research/ search/ staff/ teaching/
│                           各栏目页面
├── forms/                  江川大学报读意愿问卷
├── pic/                    主站图片
└── TSSS/                   圣殿科学学会学院子站
    ├── assets/             子站样式与脚本
    ├── pics/               子站图片
    ├── files/              办学白皮书、学科建设手册等 PDF
    ├── intranet/           子站内联网
    ├── library-portal/     资料档案室门户
    ├── ext/ legacy/ mirror/   支线叙事页面
    ├── admission-apply.html        入院申报表
    └── talent-program-apply.html   青年才俊精英培养专项计划申报表
```

## 内容说明

- **主站**：江川大学十所学院的公开官网，含招生、教学、研究、校园生活等栏目。
- **TSSS 子站**：圣殿科学学会学院（Temple Society of Science School），八大书院体系，含古法魔法 / 数理魔法解析两条培养方向。
- **三个申报表单页**：`forms/enrolment-intention.html`（报读意愿问卷，22 题）、`TSSS/admission-apply.html`（入院申报，25 项）、`TSSS/talent-program-apply.html`（青年才俊计划申报，27 项）。均为纯前端实现，提交后本地生成受理编号，不发送任何数据。

## 技术说明

- 主站页面使用 `<base href="../">` 统一解析相对路径，二级栏目页引用根目录资源时写作 `./common.css`。
- 图片已在上传前统一压缩：降采样至 1920px 宽、转 JPEG（quality 82），有透明通道的保留 PNG。
- `TSSS/files/圣殿科学学会学院_八大书院学科建设手册.pdf` 约 44 MB，未做压缩（无可用 PDF 压缩工具）。

## 安全

仓库已经过 secret 扫描（`API_KEY=`、`SECRET=`、`PASSWORD=`、`BEGIN PRIVATE KEY`、`ghp_`/`github_pat_`、`sk-`、`AKIA`、`AIza`、`.pem`/`.key`/`.crt` 等规则），**未发现任何疑似密钥文件**。`.gitignore` 已排除 `.env`、私钥证书与各类构建产物。
