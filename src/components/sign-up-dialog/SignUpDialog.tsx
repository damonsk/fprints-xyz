import { discord, github, google } from '@/assets';
import { useSignUpWithEmail, useSignUpWithSocial } from '@/hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignUpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SignUpDialog = ({ open, onOpenChange }: SignUpDialogProps) => {
  const signUpWithSocial = useSignUpWithSocial();
  const signUpWithEmail = useSignUpWithEmail();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (signUpWithEmail.isSuccess) {
      setSuccess(signUpWithEmail.data?.user?.email ?? null);
    } else if (signUpWithEmail.isError) {
      setError(signUpWithEmail.error.message);
    }
  }, [signUpWithEmail.isSuccess, signUpWithEmail.isError]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSuccess(null);
    setError(null);
    signUpWithEmail.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0">
        <div className="flex flex-col gap-4 p-6">
          <DialogHeader>
            <DialogTitle>Welcome aboard, engineer</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button
              className="h-12 gap-3 bg-black/50 text-white hover:bg-black/40 active:bg-black/50"
              leftIcon={
                <img
                  src={google}
                  alt="google"
                  className="size-6 rounded-full bg-white"
                />
              }
              onClick={() => signUpWithSocial.mutate('google')}
            >
              Sign up with Google
            </Button>
            <Button
              className="h-12 gap-3 bg-white/80 hover:bg-white/90 active:bg-white/80"
              leftIcon={<img src={github} alt="github" className="size-5" />}
              onClick={() => signUpWithSocial.mutate('github')}
            >
              Sign up with GitHub
            </Button>
            <Button
              className="h-12 gap-3 bg-[#5865F2] text-white hover:bg-[#5865F2]/90 active:bg-[#5865F2]/80"
              leftIcon={<img src={discord} alt="discord" className="size-5" />}
              onClick={() => signUpWithSocial.mutate('discord')}
            >
              Sign up with Discord
            </Button>
          </div>
        </div>
        <div className="h-px w-full bg-steel-600" />
        <div className="flex flex-col gap-4 p-6 pt-4">
          <p className="text-center text-sm text-steel-400">
            Or if you prefer the classic way
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  name="email"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="engineer@factorio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />
                <FormField
                  name="password"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Shhhh..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={signUpWithEmail.isPending}>
                    Sign up
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        {success && (
          <div className="bg-fern-400/10 p-4 text-center text-sm text-fern-400">
            An email has been sent to {success} (check spam!). Click the link in
            the email to confirm your account.
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 p-4 text-center text-sm text-red-500">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
