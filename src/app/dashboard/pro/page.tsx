import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const proFeatures = [
    "Acceso a toda la Biblioteca Emocional",
    "Análisis profundo con IA de las entradas del diario",
    "Estadísticas de progreso y logros avanzados",
    "Perspectivas predictivas de Cero",
    "Generación de contenido personalizado",
    "Soporte prioritario"
];

const freeFeatures = [
    "Seguimiento básico del estado de ánimo",
    "Diario con análisis estándar",
    "Acceso limitado a la biblioteca",
    "Seguimiento diario de hábitos"
];


export default function ProPage() {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <h1 className="text-4xl font-bold font-headline tracking-tight">Desbloquea Todo Tu Potencial</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Actualiza a Umbral Pro para obtener acceso ilimitado a todas nuestras funciones y acelerar tu viaje de autodescubrimiento y bienestar.
      </p>

      <div className="mt-10 grid max-w-4xl gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Gratis</CardTitle>
                <CardDescription>Tu punto de entrada a la atención plena.</CardDescription>
                <p className="text-4xl font-bold pt-2">$0<span className="text-lg font-normal text-muted-foreground">/mes</span></p>
            </CardHeader>
            <CardContent className="space-y-2 text-left">
                {freeFeatures.map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500"/>
                        <span className="text-muted-foreground">{feature}</span>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" disabled>Tu Plan Actual</Button>
            </CardFooter>
        </Card>
        <Card className="border-primary shadow-2xl shadow-primary/10">
            <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Para aquellos comprometidos con el crecimiento.</CardDescription>
                <p className="text-4xl font-bold pt-2">$9.99<span className="text-lg font-normal text-muted-foreground">/mes</span></p>
            </CardHeader>
            <CardContent className="space-y-2 text-left">
                {proFeatures.map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary"/>
                        <span >{feature}</span>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button className="w-full">Actualizar a Pro</Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
