import { useState } from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native';

import { router } from 'expo-router';
import { useCameraPermissions, CameraCapturedPicture } from 'expo-camera';

import Button from '@/components/button';
import Camera from '@/components/camera';

import { BACKEND_URL } from '@/globals/backend';

import styles from './styles';

export default function Upload() {
    const STAGES = ['question context', 'questions', 'rubric'];

    const [images, updateImages] = useState<CameraCapturedPicture[]>([]);
    const [curStage, updateCurStage] = useState(0);

    const [permission, requestPermission] = useCameraPermissions();
  
    const [cameraStarted, updateCameraStarted] = useState(false);

    function savePicture(image: CameraCapturedPicture) {
        updateImages([...images, image]);

        updateCurStage(curStage + 1);
        updateCameraStarted(false);
    }

    async function save() {
        const blobs: Blob[] = [];

        for(const image of images) {
            const blobResponse = await fetch(image.uri);
            const blob = await blobResponse.blob();

            blobs.push(blob);
        }

        const formData = new FormData();

        formData.append('context_image', blobs[0]);
        formData.append('questions_image', blobs[1]);
        formData.append('rubric_image', blobs[2]);
        
        try {
            const response = await fetch(`${BACKEND_URL}/assignments/`, {
                method: 'POST',
                cache: 'no-cache',
                credentials: 'same-origin',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: formData
            });

            console.log(response);

            if(!response.ok) return;

            const responseJson = await response.json();

            router.navigate({
                pathname: '/grade',
                params: {
                    id: responseJson.assignment
                }
            });
        }
        catch(e) {
            console.error(e);
        }
    }

    if (!permission) return <View />;
    if (!permission.granted)
        return (
            <View style={ styles.container }>
                <Text style={ styles.headerText }>We need your permission to show the camera</Text>

                <Button onPress={ requestPermission } black={ true }>
                    <Text style={ styles.buttonText }>grant permission</Text>
                </Button>
            </View>
        );

    if(cameraStarted) return <Camera facing="back" savePicture={ savePicture } />;

    return (
        <ScrollView
            style={ styles.container }
            contentContainerStyle={
                {
                    gap: 16
                }
            }
        >
            {
                STAGES.filter(
                    (_, i) => i < curStage
                ).map(
                    (s, i) => (
                        <Text key={ i } style={ styles.headerText }>✅ { s }</Text>
                    )
                )
            }

            {
                curStage < STAGES.length ? (
                    <>
                        <Text style={ styles.headerText }>{ STAGES[curStage] }</Text>
            
                        <Button
                            onPress={ () => updateCameraStarted(true) }
                            black={ true }
                        >
                            <Text style={ styles.buttonText } adjustsFontSizeToFit={ true }>turn on camera</Text>
                        </Button>
                    </>
                ) : (
                    <Button onPress={ save } black={ true }>
                        <Text style={ styles.buttonText }>upload</Text>
                    </Button>
                )
            }
        </ScrollView>
    );
}
