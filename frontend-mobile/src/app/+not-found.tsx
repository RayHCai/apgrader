import { StyleSheet, View, Text } from 'react-native';

import { Link } from 'expo-router';

import globalStyles from '@/globals/globalStyles';

export default function NotFoundScreen() {
    return (
        <View style={ styles.container }>
            <Text style={ styles.containerHeader }>This page doesn't exist</Text>

            <Link href="/" style={ styles.link }>
                <Text>
                    Take me back home
                </Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'        
    },
    containerHeader: {
        marginBottom: 16,
        color: globalStyles.white,
        fontSize: 32,
        fontWeight: 100,
        letterSpacing: 1
    },
    link: {
        fontSize: 18,
        fontWeight: 100,
        color: globalStyles.white,
        cursor: 'pointer',
        textDecorationLine: 'underline',
        lineHeight: 4,
        textDecorationColor: 'rgb(88, 88, 88)'
    }
});
