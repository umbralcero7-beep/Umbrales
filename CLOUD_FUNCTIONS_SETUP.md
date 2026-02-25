# Desplegar Cloud Functions

Las Cloud Functions que envían recordatorios de hábitos están listas en la carpeta `functions/`.

## Pasos para desplegar:

### 1. Instala Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
```

### 2. Auténticate con Firebase
```bash
firebase login
```

### 3. Inicializa Firebase (si es necesario)
```bash
firebase init
```

### 4. Compila las funciones
```bash
cd functions
npm run build
cd ..
```

### 5. Despliega las funciones
```bash
firebase deploy --only functions
```

## ¿Qué hacen las funciones?

### `sendHabitReminders`
- **Ejecuta**: Cada minuto
- **Función**: Revisa todos los usuarios y sus hábitos
- **Acción**: Si la hora actual coincide con el recordatorio, envía una notificación push
- **Tokens**: Usa los tokens push guardados en Firestore para cada usuario

### `cleanupOldCompletions`
- **Ejecuta**: Diariamente a las 3:00 AM
- **Función**: Limpia completaciones de hábitos más antiguas de 90 días
- **Beneficio**: Mantiene la base de datos limpia

## Flujo de notificaciones ahora:

1. **Usuario configura recordatorio** → Hora se guarda en Firestore junto al hábito
2. **Firebase Cloud Function ejecuta cada minuto** → Revisa si algún recordatorio coincide con la hora actual
3. **Notificación enviada** → FCM envía a todos los dispositivos del usuario con push tokens válidos
4. **Tokens inválidos removidos** → Si algún token falla, se elimina de Firestore automáticamente

## Para probar localmente:

```bash
firebase emulators:start --only functions
```

Luego en otra terminal:
```bash
firebase functions:shell
```

## Variables de entorno (si son necesarias)

Crea un archivo `.env.local` en la carpeta `functions/` si necesitas variables:

```
TIMEZONE=America/Bogota
```

El timezone ya está configurado en America/Bogota pero puedes cambiarlo según tus necesidades.

## Importante

- Las Cloud Functions solo funcionan si:
  - ✅ Los usuarios tienen permisos para recibir notificaciones
  - ✅ Sus tokens push están guardados en Firestore (en la colección usuarios)
  - ✅ Tienes habilitado FCM en tu proyecto de Firebase
  - ✅ Las funciones están desplegadas en Firebase

## Próximos pasos

1. Despliega las funciones con `firebase deploy --only functions`
2. En Firebase Console, verifica que las funciones aparezcan bajo "Functions"
3. Prueba creando un hábito con recordatorio en la app
4. Revisa los logs con `firebase functions:log`
