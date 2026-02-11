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

export function PrivacySettings() {
    const { toast } = useToast();
    const router = useRouter();

    const handleExport = () => {
        // In a real app, this would fetch data from a backend.
        // Here, we simulate it with localStorage data.
        const dataToExport = {
            userName: localStorage.getItem('userName'),
            habits: JSON.parse(localStorage.getItem('umbral_habits') || '[]'),
            // We can't export journal entries as they are not persisted.
            journalEntries: "No exportable en esta versión de demostración."
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

    const handleDeleteAccount = () => {
        // In a real app, this would call a backend endpoint to delete the user.
        // Here, we just clear localStorage and redirect.
        localStorage.clear();
        toast({
            title: "Cuenta Eliminada",
            description: "Tus datos locales han sido borrados. Serás redirigido.",
        });
        router.push('/');
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y borrará todos tus datos de nuestros servidores.
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
