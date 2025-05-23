import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { APIURL } from '@/lib/constoct';
import { useEffect, useRef } from 'react';

const Login = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const navigator = useNavigate();

  const getqrkey = async () => {
    try {
      const res1 = await fetch(
        `${APIURL}/login/qr/key?timestamp=${Date.now()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await res1.json();
      // console.log(data.data);
      const key = data.data.unikey;

      const res2 = await fetch(
        `${APIURL}/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const data2 = await res2.json();
      // console.log(data2.data);
      const qrimg = data2.data.qrimg;
      imgRef.current!.src = qrimg;

      const timer = setInterval(async () => {
        const statusRes = await checkStatus(key);
        if (statusRes.code === 800) {
          // alert('二维码已过期,请重新获取');
          toast.warning('二维码已过期,请重新获取');
          clearInterval(timer);
        }
        if (statusRes.code === 803) {
          // 这一步会返回cookie
          clearInterval(timer);
          // alert('授权登录成功');
          toast.success('授权登录成功');
          // console.log(statusRes.cookie);
          localStorage.setItem('cloundmusic', statusRes.cookie);
          // await getLoginStatus();
          navigator('/');
          window.location.href = '/';
        }
      }, 3000);
    } catch (error) {
      console.error('获取二维码失败:', error);
      toast.error('获取二维码失败');
    }
  };

  const checkStatus = async (key: string) => {
    const res = await fetch(
      `${APIURL}/login/qr/check?key=${key}&timestamp=${Date.now()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    const data = await res.json();
    return data;
  };

  useEffect(() => {
    getqrkey();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-12">
      <Toaster position="top-center" richColors />
      <Card className=" h-4/6 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <CardDescription>
            <span>欢迎来到网易云音乐</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img src="" alt="二维码" ref={imgRef} className="rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
