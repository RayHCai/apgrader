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
                    () => router.navigate({
                        pathname: '/grade',
                        params: {
                            id: 'e3291eea-32ac-4795-b1e1-f973e43367ff'
                        }
                    }) //router.navigate('/upload')
                }
            >
                <Text style={ styles.startGradingText }>start grading</Text>
            </Button>
        </ScrollView>
    );
}
