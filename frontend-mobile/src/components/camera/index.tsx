import { useRef, useState } from 'react';
import {
    StyleSheet,
    Pressable,
    ImageBackground,
    View,
    Text
} from 'react-native';

import { CameraCapturedPicture, CameraView } from 'expo-camera';

import { BACKEND_URL } from '@/globals/backend';
import globalStyles from '@/globals/globalStyles';

type CameraProps = {
    facing: 'front' | 'back';
    savePicture: (image: CameraCapturedPicture) => void;
};

export default function Camera(props: CameraProps) {
    const cameraRef = useRef<CameraView>(null);
    const [preview, updatePreview] = useState<CameraCapturedPicture>();

    async function takePicture() {
        const data = await cameraRef.current!.takePictureAsync();

        updatePreview(data);
    }

    if(preview)
        return (
            <View
                style={
                    {
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'none'
                    }
                }
            >
                <ImageBackground
                    source={{ uri: preview.uri }}
                    style={ StyleSheet.absoluteFill }
                >
                    <Pressable
                        onPress={
                            () => props.savePicture(preview)
                        }
                        style={ styles.uploadTextButton }
                    >
                        <Text style={ styles.uploadText }>upload</Text>
                    </Pressable>
                </ImageBackground>
            </View>
        );

    return (
        <CameraView
            style={ StyleSheet.absoluteFill }
            facing={ props.facing }
            mode="picture"
            ref={ cameraRef }
        >
            <Pressable style={ styles.pictureButton } onPress={ takePicture } />
        </CameraView>
    );
}

const styles = StyleSheet.create({
    pictureButton: {
        position: 'absolute',
        bottom: 0,
        margin: 20,
        width: 60,
        height: 60,
        left: 55,
        transform: [{ translateX: 100 }],
        backgroundColor: globalStyles.white,
        borderRadius: 100
    },
    uploadTextButton: {
        position: 'absolute',
        bottom: 0,
        margin: 20,
        left: 55,
        transform: [{ translateX: 55 }],
        backgroundColor: globalStyles.black,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 5
    },
    uploadText: {
        color: globalStyles.white,
        fontSize: 24,
        letterSpacing: 2,
        textTransform: 'uppercase',
        textAlign: 'center',
    }
});
