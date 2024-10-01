import { ScrollView, Text } from 'react-native';
import { router } from 'expo-router';

import Button from '@/components/button';

import styles from './styles';

export default function Home() {
    return (
        <ScrollView style={ styles.container }>
            <Text style={ styles.headerText }>apgrader</Text>

            <Button
                onPress={
                    () => router.navigate('/upload')
                }
            >
                <Text style={ styles.startGradingText }>start grading</Text>
            </Button>
        </ScrollView>
    );
}
