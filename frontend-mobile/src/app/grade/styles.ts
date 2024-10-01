import { StyleSheet } from 'react-native';

import globalStyles from '@/globals/globalStyles';

const styles = StyleSheet.create({
    container: {
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 32,
        gap: 32
    },
    headerText: {
        width: '100%',
        textAlign: 'center',
        alignSelf: 'center',
        color: globalStyles.black,
        fontSize: 20,
        letterSpacing: 2,
    },
    buttonText: {
        color: globalStyles.black,
        fontSize: 11,
        textAlign: 'center',
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
    reasoning: {
        fontSize: 11
    }
});

export default styles;
