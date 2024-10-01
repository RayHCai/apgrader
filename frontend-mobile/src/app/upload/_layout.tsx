import { Stack } from 'expo-router';

import globalStyles from '@/globals/globalStyles';

export default function UploadLayout() {
    return (
        <Stack
            screenOptions={
                {
                    contentStyle: {
                        backgroundColor: globalStyles.white
                    }
                }
            }
        >
            <Stack.Screen name="index" options={ { headerShown: false } } />
        </Stack>
    );
}
