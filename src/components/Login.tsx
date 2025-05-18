import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { APIURL } from '@/lib/constoct';

const Login = () => {
  const [input, setInput] = useState({
    phone: '',
    chekedCode: '',
  });

  const phoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      phone: e.target.value,
    });
  };

  const chekedCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      chekedCode: e.target.value,
    });
  };

  const getCheckedCode = async () => {
    const res = await fetch(
      `${APIURL}/captcha/sent?phone=${input.phone}&timestamp=${Date.now()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const data = await res.json();
    console.log(data);
    if (data.code === 200 && data.data) {
      toast.warning('验证码已发送,注意查收');
    } else if (data.code === 400 && data.message) {
      toast.error(data.message);
    } else {
      toast.error('验证码发送失败,请稍后重试');
    }
  };

  const login = async () => {
    const res = await fetch(
      `${APIURL}/login/cellphone?phone=${input.phone}&captcha=${
        input.chekedCode
      }&timestamp=${Date.now()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-12">
      <Toaster position="top-center" richColors />
      <Card className="w-1/3 h-2/4 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <CardDescription>
            <span>欢迎来到网易云音乐</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3">
            <div className="flex flex-row gap-3 w-full">
              <Label>手机号 :</Label>
              <Input
                type="text"
                placeholder="请输入手机号"
                className="flex-1"
                onChange={(e) => phoneChange(e)}
              />
            </div>
            <div className="flex flex-row gap-3 w-full">
              <Label>验证码 :</Label>
              <Input
                type="text"
                placeholder="请输入验证码"
                className="flex-1"
                onChange={(e) => chekedCodeChange(e)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-3">
          <Button
            variant="default"
            className="w-full cursor-pointer"
            onClick={getCheckedCode}
          >
            获取验证码
          </Button>
          <Button
            variant="default"
            className="w-full cursor-pointer"
            onClick={login}
          >
            登录
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
