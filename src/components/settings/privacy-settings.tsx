'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { deleteUser } from "firebase/auth";

export function PrivacySettings() {
    const { toast } = useToast();
    const router = useRouter();
    const auth = useAuth();

    const handleExport = () => {
        // In a real app, this would fetch data from a backend.
        // Here, we simulate it with localStorage data.
        const user = auth.currentUser;
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "Debes iniciar sesión para exportar datos." });
            return;
        }

        const dataToExport = {
            habits: JSON.parse(localStorage.getItem(`umbral_habits_v2_${user.uid}`) || '[]'),
            journal: JSON.parse(localStorage.getItem(`umbral_journal_entries_${user.uid}`) || '[]'),
        };

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'umbral_data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        toast({
            title: "Exportación Iniciada",
            description: "Tu archivo de datos se está descargando.",
        });
    }

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "No hay ninguna cuenta para eliminar." });
            return;
        }

        try {
            await deleteUser(user);
            toast({
                title: "Cuenta Eliminada",
                description: "Tu cuenta ha sido eliminada permanentemente. Serás redirigido.",
            });
            // The onAuthStateChanged listener in FirebaseProvider will handle the redirect.
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast({
                variant: "destructive",
                title: "Error al eliminar la cuenta",
                description: "Por favor, cierra sesión y vuelve a iniciarla antes de intentar eliminar tu cuenta.",
            });
        }
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Tu confianza es nuestra prioridad. Tus entradas de diario son procesadas por nuestra IA para darte análisis, pero no se almacenan a largo plazo. Tienes control total sobre tus datos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleExport}>
                    Exportar mis datos
                </Button>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Eliminar mi cuenta</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y tus datos de Firebase. Los datos locales del navegador también se volverán inaccesibles.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            Sí, eliminar mi cuenta
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
