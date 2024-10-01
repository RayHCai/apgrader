import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import globalStyles from '@/globals/globalStyles';

type ButtonProps = PropsWithChildren & {
    onPress: () => void;
    black?: boolean;
};

export default function Button(props: ButtonProps) {
    const styles = StyleSheet.create(
        {
            startGradingButton: {
                width: '50%',
                alignSelf: 'center',
                padding: 20,
                borderColor: props.black ? globalStyles.black : globalStyles.white,
                borderWidth: 1,
                backgroundColor: 'none',
                cursor: 'pointer'
            },
        }
    );

    return (
        <Pressable
            style={ styles.startGradingButton }
            onPress={ props.onPress }
        >
            { props.children }
        </Pressable>
    );
}
