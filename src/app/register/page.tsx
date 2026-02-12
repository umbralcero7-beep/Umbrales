'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OnboardingQuiz } from '@/components/onboarding/onboarding-quiz';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Tu nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

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

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    setUserName(values.name);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(firestore, "users", user.uid), {
            id: user.uid,
            email: values.email,
            username: values.name,
            subscriptionType: 'free',
        });
        
        // The onAuthStateChanged listener will handle the session state.
        // Proceed to onboarding.
        setStep(2);

    } catch (error: any) {
        console.error("Registration failed:", error);
        toast({
            variant: "destructive",
            title: "Error en el registro",
            description: "Este correo electrónico ya podría estar en uso. Por favor, inténtalo con otro.",
        });
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[450px] gap-6 px-4">
            <div className="grid gap-2 text-center">
                <div className="flex justify-center items-center gap-2">
                    <Logo className="h-8 w-8"/>
                    <h1 className="text-3xl font-bold font-headline">Umbral</h1>
                </div>
            </div>

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Crea tu cuenta</CardTitle>
                        <CardDescription>Comienza tu viaje de autodescubrimiento.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="grid gap-4">
                                <FormField control={registerForm.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tu nombre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={registerForm.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo Electrónico</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="tu@correo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={registerForm.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                                    Siguiente
                                </Button>
                            </form>
                        </Form>
                         <p className="mt-4 px-0 text-center text-sm">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                href="/"
                                className="underline"
                            >
                                Iniciar Sesión
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <OnboardingQuiz userName={userName} />
            )}
        </div>
      </div>
       <div className="hidden bg-muted lg:block">
        <Image
          data-ai-hint="calm abstract"
          src="https://picsum.photos/seed/umbral-register/1200/1800"
          alt="Image"
          width="1200"
          height="1800"
          className="h-full w-full object-cover dark:brightness-[0.3] rounded-2xl"
        />
      </div>
    </div>
  );
}
