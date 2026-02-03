"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const suggestedHabitsByCategory = [
    {
      category: '🌱 Cuidar tu cuerpo',
      items: [
        { name: 'Movimiento diario', description: 'Aunque sea caminar 20 minutos, estirarte o hacer una rutina corta.'},
        { name: 'Alimentación consciente', description: 'Elegir comidas que te den energía en lugar de agotarte.'},
        { name: 'Descanso', description: 'Mantener horarios de sueño regulares.'},
      ]
    },
    {
      category: '🧠 Nutrir tu mente',
      items: [
        { name: 'Lectura o aprendizaje', description: 'Dedicar al menos 15 minutos a leer, estudiar o explorar algo nuevo.'},
        { name: 'Reflexión', description: 'Escribir un par de líneas sobre lo que aprendiste o cómo te sentiste en el día.'},
        { name: 'Evitar distracciones excesivas', description: 'Reducir tiempo en redes sociales sin propósito.'},
      ]
    },
    {
      category: '💡 Conectar con propósito',
      items: [
        { name: 'Planificación breve', description: 'Cada mañana, definir 3 prioridades claras.'},
        { name: 'Gratitud', description: 'Reconocer algo positivo del día, por pequeño que sea.'},
        { name: 'Relaciones', description: 'Dedicar tiempo a hablar con alguien importante para ti, aunque sea un mensaje corto.'},
      ]
    },
];


export function HabitSuggestions() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAddHabit = (habitName: string) => {
    toast({
        title: "¡Hábito Añadido!",
        description: `"${habitName}" ha sido añadido a tu lista.`,
    })
    // In a real app, you'd also update the global state or call an API here
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Lightbulb className="mr-2 h-4 w-4" />
          Sugerencias de Hábitos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2"><Lightbulb /> Hábitos Fundamentales</DialogTitle>
          <DialogDescription>
            Ideas para construir una rutina que te apoye. Añade los que resuenen contigo.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="multiple" defaultValue={[suggestedHabitsByCategory[0].category]} className="w-full max-h-[60vh] overflow-y-auto pr-4">
            {suggestedHabitsByCategory.map((category) => (
                <AccordionItem value={category.category} key={category.category}>
                    <AccordionTrigger className="font-semibold text-left hover:no-underline">{category.category}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3">
                            {category.items.map((habit, index) => (
                                <div key={index} className="flex items-center justify-between gap-2 p-3 border rounded-lg bg-muted/40">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{habit.name}</p>
                                        <p className="text-xs text-muted-foreground">{habit.description}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => handleAddHabit(habit.name)}>
                                        <Plus className="h-4 w-4" />
                                        <span className="sr-only">Añadir hábito {habit.name}</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
