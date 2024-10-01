import { StyleSheet } from 'react-native';

import globalStyles from '@/globals/globalStyles';

const styles = StyleSheet.create({
    container: {
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 32,
    },
    headerText: {
        textAlign: 'center',
        color: globalStyles.white,
        fontSize: 32,
        letterSpacing: 2,
        margin: 64
    },
    startGradingText: {
        color: globalStyles.white,
        fontSize: 11,
        textAlign: 'center',
        letterSpacing: 2,
        textTransform: 'uppercase'
    }
});

export default styles;
