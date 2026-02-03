import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/settings/theme-switcher";
import { PasswordForm } from "@/components/settings/password-form";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold font-headline">Ajustes</h1>
                <p className="text-muted-foreground">
                    Gestiona la apariencia de la aplicación y la configuración de tu cuenta.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Apariencia</CardTitle>
                    <CardDescription>
                        Personaliza la apariencia de la aplicación. Elige el tema que más resuene contigo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemeSwitcher />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Cuenta</CardTitle>
                    <CardDescription>
                        Actualiza la configuración de tu cuenta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PasswordForm />
                </CardContent>
            </Card>
            <div className="text-center text-sm text-muted-foreground pt-4">
                <p>Versión 1.0.0</p>
                <p>Creado con ❤️ por Umbral Cero</p>
            </div>
        </div>
    );
}
