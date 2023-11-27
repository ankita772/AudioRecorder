import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { Audio } from "expo-av";

const Recorder = () => {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [recordUri, setRecordUri] = useState(null);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordUri(uri);
    console.log("Recording stopped and stored at", uri);
  }
  const playSound = async () => {
    try {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(
        // require("../assets/Hello.mp3"),
        { uri: recordUri },
        { shouldPlay: true } // Set shouldPlay to false to avoid automatic playback
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error loading or playing sound", error);
    }
  };

  const pauseSound = async () => {
    try {
      console.log("Pause Sound");
      await sound.pauseAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{
          padding: 40,
          elevation: 10,
          borderRadius: 100,
          backgroundColor: recording ? "#13F932" : "#fff",
        }}
      >
        <Image
          source={require("../assets/mic.png")}
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>
      <View
        style={{
          width: "50%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 20,
        }}
      >
        <Button title="Play" onPress={playSound} />
        <Button title="Pause" onPress={pauseSound} />
      </View>
    </View>
  );
};

export default Recorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginVertical: 100,
    // justifyContent: "center",
    // backgroundColor: "#ecf0f1",
    // padding: 10,
  },
});
