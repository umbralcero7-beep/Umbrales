'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUser, useAuth } from "@/firebase"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";


const Logo = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={cn(className)}
    >
      <path
        d="M52,60.1V32.5C52,18.4,41.6,8,27.5,8S3,18.4,3,32.5v27.6H52z"
        fill="#feeaa6"
      />
      <circle cx="27.5" cy="24" r="8" fill="#f9b112" />
      <path
        d="M3,60.1l11-20.3l8.6,13.8l12.4-23.3L52,60.1H3z"
        fill="#706293"
      />
      <path
        d="M3,60.1l17.3-21.8L28,50.7l10.7-19.4l-3.3,4.4l12.6,14.4H3z"
        fill="#483d73"
      />
      <path
        d="M55,32.5C55,16.8,42.7,4.5,27.5,4.5S0,16.8,0,32.5v27.6C0,61.2,0.9,62,2,62h51c1.1,0,2-0.8,2-1.9V32.5z M52,58.1H3V32.5 C3,18.4,13.9,8,27.5,8S52,18.4,52,32.5V58.1z"
        fill="#f9b112"
      />
    </svg>
  );

  const loginSchema = z.object({
    email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
    password: z.string().min(1, { message: "Por favor, introduce tu contraseña." }),
    remember: z.boolean().default(false),
  });

export default function LoginPage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", remember: true },
    });

    useEffect(() => {
        if (user && !isUserLoading) {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, router]);

    async function onSubmit(values: z.infer<typeof loginSchema>) {
      try {
        const persistence = values.remember ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistence);
        await signInWithEmailAndPassword(auth, values.email, values.password);
        // The onAuthStateChanged listener in the provider will handle the redirect.
      } catch (error: any) {
        console.error("Login failed:", error);
        toast({
          variant: "destructive",
          title: "Error al iniciar sesión",
          description: "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.",
        });
      }
    }
    
    if (isUserLoading || user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="flex justify-center items-center gap-2">
                <Logo className="h-8 w-8" />
                <h1 className="text-3xl font-bold font-headline">Umbral</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Tu santuario para el bienestar mental y el crecimiento personal.
            </p>
          </div>
          <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Bienvenido a Umbral</CardTitle>
                <CardDescription>
                Inicia sesión para continuar tu viaje.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="tu@correo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center">
                                    <FormLabel>Contraseña</FormLabel>
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="remember"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Mantener la sesión iniciada
                                    </FormLabel>
                                </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Iniciar Sesión
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/register">Crear una cuenta</Link>
                        </Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          data-ai-hint="calm abstract"
          src="https://picsum.photos/seed/umbral-login/1200/1800"
          alt="Image"
          width="1200"
          height="1800"
          className="h-full w-full object-cover dark:brightness-[0.3] rounded-2xl"
        />
      </div>
    </div>
  )
}
