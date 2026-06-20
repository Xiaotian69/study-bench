import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "数学分析 · 同步精读工作台",
  description: "按教材顺序精读数学分析，配合 AI 追问、练习与批改。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="page-frame">
          <header className="masthead">
            <div className="masthead-brand">
              <p className="masthead-title">
                <span className="mark">数</span>学分析
              </p>
              <p className="masthead-sub">同步精读工作台</p>
            </div>
            <p className="masthead-meta">讲义 · 追问 · 练习 · 批改</p>
          </header>
          {children}
          <footer className="site-footer">
            <span>按教材顺序精读 · AI 同步辅导</span>
            <span className="sep">/</span>
            <span>自带模型 Key，学习进度只存在本机</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
