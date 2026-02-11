'use client';

import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ThemeOption = {
    name: 'zen' | 'calma' | 'cosmos' | 'bosque' | 'atardecer';
    label: string;
    description: string;
    colors: string[];
}

const themes: ThemeOption[] = [
    {
        name: 'zen',
        label: '🔮 Tema Predeterminado',
        description: 'Una paleta moderna con tonos índigo y púrpuras.',
        colors: ['bg-[#3F51B5]', 'bg-[#F0F4F8]', 'bg-[#8E24AA]']
    },
    {
        name: 'calma',
        label: '🌊 Tema Calma',
        description: 'Tonos suaves que transmiten paz y relajación.',
        colors: ['bg-[#4D7DDE]', 'bg-[#F4F8FD]', 'bg-[#E8E3F8]']
    },
    {
        name: 'cosmos',
        label: '🌌 Tema Cosmos',
        description: 'Inspirado en el misterio del universo nocturno.',
        colors: ['bg-[#9370db]', 'bg-[#161320]', 'bg-[#e6b84d]']
    },
    {
        name: 'bosque',
        label: '🌳 Tema Bosque',
        description: 'Verdes profundos para una sensación de calma y naturaleza.',
        colors: ['bg-[#45B86A]', 'bg-[#1D2B23]', 'bg-[#C49264]']
    },
    {
        name: 'atardecer',
        label: '🌅 Tema Atardecer',
        description: 'Colores cálidos inspirados en la magia de un atardecer.',
        colors: ['bg-[#F97316]', 'bg-[#1F1A2B]', 'bg-[#ED5E93]']
    }
];

export function ThemeSwitcher() {
    const { theme: activeTheme, setTheme } = useTheme();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
                <Card
                    key={theme.name}
                    onClick={() => setTheme(theme.name)}
                    className={cn(
                        "cursor-pointer transition-all hover:shadow-lg",
                        activeTheme === theme.name && "ring-2 ring-primary shadow-lg"
                    )}
                >
                    <CardHeader>
                        <CardTitle className="text-lg">{theme.label}</CardTitle>
                        <CardDescription className="text-xs min-h-[32px]">{theme.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Paleta:</p>
                            <div className="flex gap-1">
                                {theme.colors.map((color, index) => (
                                    <div key={index} className={cn("h-5 w-5 rounded-full border", color)} />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
