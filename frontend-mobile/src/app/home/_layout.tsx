import { Stack } from 'expo-router';

import globalStyles from '@/globals/globalStyles';

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={
                {
                    contentStyle: {
                        backgroundColor: globalStyles.black
                    }
                }
            }
        >
            <Stack.Screen name="index" options={ { headerShown: false } } />
        </Stack>
    );
}
