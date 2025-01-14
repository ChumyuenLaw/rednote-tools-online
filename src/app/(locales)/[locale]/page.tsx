'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Download, Lock, Infinity, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from "next/link";
import { UrlInput } from '@/components/url-input';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'image' | 'video', url: string } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    try {
      // Mock API call - 这里后续会替换为真实的API
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('解析失败');
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: '解析成功',
        description: '点击下载按钮即可保存',
      });
    } catch (error) {
      toast({
        title: '解析失败',
        description: '请确保链接正确并重试',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "无水印下载",
      description: "轻松下载小红书图片和视频，完全去除水印"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "安全可靠",
      description: "所有处理在服务器端完成，保护您的隐私"
    },
    {
      icon: <Infinity className="h-6 w-6" />,
      title: "免费使用",
      description: "完全免费，无需注册，随时使用"
    }
  ];

  const faqs = [
    {
      question: "如何使用这个工具？",
      answer: "只需复制小红书的分享链接，粘贴到输入框中，点击获取按钮即可。支持图片和视频内容。"
    },
    {
      question: "支持批量下载吗？",
      answer: "目前仅支持单条内容下载，批量下载功能正在开发中。"
    },
    {
      question: "为什么有时候会解析失败？",
      answer: "可能是因为链接失效或者内容已被删除，建议检查链接是否正确，然后重试。"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <Logo />
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Link
            href="/contact"
            className="flex place-items-center gap-2 p-8 lg:p-0"
          >
            联系我们
          </Link>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-4">
          小红书无水印下载工具
        </h1>
        <p className="text-xl text-center mb-8 text-gray-600">
          轻松下载小红书图片和视频，完全免费，无需注册
        </p>

        <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />

        {result && (
          <div className="mt-8 w-full max-w-xl">
            <div className="rounded-lg border p-4">
              <div className="aspect-video relative">
                {result.type === 'image' ? (
                  <img src={result.url} alt="预览" className="w-full h-full object-contain" />
                ) : (
                  <video src={result.url} controls className="w-full h-full" />
                )}
              </div>
              <a
                href={result.url}
                download
                className="mt-4 flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
              >
                <Download className="h-4 w-4" />
                下载{result.type === 'image' ? '图片' : '视频'}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="my-16 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <div className="flex items-center gap-2 mb-3">
              {feature.icon}
              <h2 className="text-2xl font-semibold">{feature.title}</h2>
            </div>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="my-16 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-8 text-center">常见问题</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg">
              <button
                className="w-full px-4 py-2 text-left flex justify-between items-center"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="px-4 py-2 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
