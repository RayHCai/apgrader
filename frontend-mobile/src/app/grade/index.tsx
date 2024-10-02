import { useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';

import { CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';

import Camera from '@/components/camera';
import Button from '@/components/button';

import { BACKEND_URL } from '@/globals/backend';

import styles from './styles';

export default function Grade() {
    const local = useLocalSearchParams<{ id: string }>();
    const assignmentId = local.id;

    const [permission, requestPermission] = useCameraPermissions();
  
    const [cameraStarted, updateCameraStarted] = useState(false);
    const [grades, updateGrades] = useState<Grade>();

    const [image, updateImage] = useState<CameraCapturedPicture>();

    async function upload(image: CameraCapturedPicture) {
        updateImage(image);

        const blobResponse = await fetch(image.uri);
        const blob = await blobResponse.blob();

        const formData = new FormData();

        formData.append('student_image', blob);
        formData.append('id', assignmentId);

        const response = await fetch(`${BACKEND_URL}/grade/`, {
            method: 'POST',
            body: formData
        });

        if(!response.ok) return;

        const responseJson = await response.json();
        
        console.log(responseJson.grade);
        updateGrades(responseJson.grade);
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

    if(cameraStarted) return <Camera facing="back" savePicture={ upload } />;

    if(grades)
        return (
            <View
                style={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 20
                    }
                }
            >
                <ImageBackground
                    source={{ uri: image!.uri }}
                    style={
                        {
                            width: 300,
                            height: 300
                        }
                    }
                />

                {
                    Object.keys(grades).map(
                        (key, i) => (
                            <View key={ i }>
                                <Text style={ styles.headerText }>
                                    { key }: { grades[key].score }
                                </Text>

                                <Text style={ styles.reasoning }>
                                    { grades[key].reasoning }
                                </Text>
                            </View>
                        )
                    )
                }
            </View>
        );

    return (
        <View style={ styles.container }>
            <Text style={ styles.headerText }>upload student response</Text>
            
            <Button
                onPress={ () => updateCameraStarted(true) }
                black={ true }
            >
                <Text style={ styles.buttonText } adjustsFontSizeToFit={ true }>turn on camera</Text>
            </Button>
        </View>
    );
}
