import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { bufferToWave } from '../utils/audio-helper';
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';
import { HttpClient } from '@angular/common/http';

// await register(await connect());
// import * as RECORDER from 'node-record-lpcm16';


@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {

  // private apiUrl: string = "https://localhost:7044/";
  private apiUrl: string = "https://bluejay-inspired-uniformly.ngrok-free.app/";

  private chunks: any[] = [];
  private mediaRecorder: any;
  private audioContext: AudioContext = new AudioContext();
  private audioBlobSubject = new Subject<Blob>();
  timeout: any;


  audioBlob$ = this.audioBlobSubject.asObservable();

  constructor(private http: HttpClient){
    this.init();
  }

  async init(){
    await register(await connect());
  }

  async startRecording() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = (event: any) => this.chunks.push(event.data);
    this.mediaRecorder.start();
  }

  async stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.onstop = async () => {
        const audioData = await new Blob(this.chunks).arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(audioData);
        const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);
        this.audioBlobSubject.next(wavBlob);
        this.chunks = [];
      };

      this.mediaRecorder.stop();
    }
  }

  getTranscription(file: File){
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUrl + 'api/SpeechToText/GenerateTranscript', formData);
  }

  async stopStreamingRecording(){
    if(this.mediaRecorder){
      // this.mediaRecorder.requestData();
      this.mediaRecorder.stop();
      // clearInterval(this.timeout);
    }
  }

  async startStreamRecording(){
    console.log('audioContext state: ', this.audioContext.state);
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    const stream = await navigator.mediaDevices.getUserMedia({audio : true});
    // const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(this.audioContext, { mediaStream: stream });
    // const mediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode(this.audioContext);
    // mediaStreamAudioSourceNode.connect(mediaStreamAudioDestinationNode);
    // this.mediaRecorder = new MediaRecorder(mediaStreamAudioDestinationNode.stream);

    this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/wav'});

    this.mediaRecorder.ondataavailable = async (event: any) => {
      console.log('event available: ', event);
      // let audioPacket: any[] = [];
      // audioPacket.push(event.data);
      // this.chunks.push(event.data);
      // const audioData = await new Blob(this.chunks).arrayBuffer();
      // const currentAudioData = await new Blob([event.data]).arrayBuffer();
      // console.log('audioData: ', audioData);
      // console.log('currentAudioData: ', currentAudioData);
      // const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      // const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);

      const wavBlob = new Blob([event.data], {type: 'audio/wav'});

      // const link = window.URL.createObjectURL(wavBlob);
      // var a = document.createElement("a");
      // a.setAttribute("download", "test.wav");
      // a.setAttribute("href", link);
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      console.log('Mediarecorder ondataavailable wavblob: ', wavBlob);
      this.audioBlobSubject.next(wavBlob);
      // this.mediaRecorder.stop();
    };
    this.mediaRecorder.start(3000);

    // this.timeout = setInterval(() => {
    //   if(this.mediaRecorder.state === 'recording'){
    //    this.mediaRecorder.requestData();
    //   }
    //   else{
    //     clearInterval(this.timeout);
    //   }
    // }, 3000);
  }

  // startStreamRecordingLPCM(){
  //   RECORDER.record({
  //     sampleRateHertz: 48000,
  //     channels: 1,
  //     threshold: 0,
  //     recorder: 'rec',
  //     silence: '10.0'
  //   })
  //   .on('error', console.error)
  //   .pipe((audio: any) => {
  //     console.log(audio);
  //   });
  // }

}