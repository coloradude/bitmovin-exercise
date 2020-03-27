require('dotenv')

const API = require('@bitmovin/api-sdk')

const BitmovinApi = API.default;
const S3Input = API.S3Input
const S3Output = API.S3Output
const H264VideoConfiguration = API.H264VideoConfiguration
const AacAudioConfiguration = API.AacAudioConfiguration
const Encoding = API.Encoding
const StreamInput = API.StreamInput
const Stream = API.Stream
const AclEntry = API.AclEntry
const Fmp4Muxing = API.Fmp4Muxing
const MuxingStream = API.MuxingStream
const EncodingOutput = API.EncodingOutput
const DashManifest = API.DashManifest
const Period = API.Period
const VideoAdaptationSet = API.VideoAdaptationSet
const AudioAdaptationSet = API.AudioAdaptationSet
const DashFmp4Representation = API.DashFmp4Representation
const PresetConfiguration = API.PresetConfiguration
const StreamSelectionMode = API.StreamSelectionMode
const AclPermission = API.AclPermission
const TsMuxing = API.TsMuxing
const DashRepresentationType = API.DashRepresentationType
const HlsManifest = API.HlsManifest
const AudioMediaInfo = API.AudioMediaInfo
const ConsoleLogger = API.ConsoleLogger
const Status = API.Status
const CencDrm = API.CencDrm


const main = async () => {

  const bitmovinApi = new BitmovinApi({
    apiKey: process.env.BITMOVIN_API_KEY,
    //logger: new ConsoleLogger()
  })
  
  console.log('Creating input...')
  
  const input = await bitmovinApi.encoding.inputs.s3.create(
    new S3Input({
      name: 'yukon_carrot',
      accessKey: process.env.INPUT_ACCESS_KEY,
      secretKey: process.env.INPUT_SECRET_KEY,
      bucketName: 'bitmovin-test-stephen-2'
    })
  );
  
  console.log('Creating output...')
  
  const output = await bitmovinApi.encoding.outputs.s3.create(
    new S3Output({
      name: 'yukon_carrot_output',
      accessKey: process.env.OUTPUT_ACCESS_KEY,
      secretKey: process.env.OUTPUT_SECRET_KEY,
      bucketName: 'bitmovin-test-stephen-2'
    })
  );
  
  console.log('Creating config 1...')
  
  const videoCodecConfiguration1 = await bitmovinApi.encoding.configurations.video.h264.create(
    new H264VideoConfiguration({
      name: 'Getting Started H264 Codec Config 1',
      bitrate: 1500000,
      width: 1024,
      presetConfiguration: PresetConfiguration.VOD_STANDARD
    })
  );
  
  console.log('Creating config 2...')
  
  
  const videoCodecConfiguration2 = await bitmovinApi.encoding.configurations.video.h264.create(
    new H264VideoConfiguration({
      name: 'Getting Started H264 Codec Config 2',
      bitrate: 1000000,
      width: 768,
      presetConfiguration: PresetConfiguration.VOD_STANDARD
    })
  );
  
  console.log('Creating config 3')
  
  const videoCodecConfiguration3 = await bitmovinApi.encoding.configurations.video.h264.create(
    new H264VideoConfiguration({
      name: 'Getting Started H264 Codec Config 3',
      bitrate: 750000,
      width: 640,
      presetConfiguration: PresetConfiguration.VOD_STANDARD
    })
  );
  
  console.log('Creating audio config...')
  
  const audioCodecConfiguration = await bitmovinApi.encoding.configurations.audio.aac.create(
    new AacAudioConfiguration({
      name: 'Getting Started Audio Codec Config',
      bitrate: 128000
    })
  );
  
  console.log('Creating encoding')
  
  const encoding = await bitmovinApi.encoding.encodings.create(
    new Encoding({
      name: 'Yukon and His Carrot Encoding',
    })
  );
  
  const inputPath = '/yukon_carrot.mp4';

  
  console.log('Video stream 1...')
  const videoStreamInput1 = new StreamInput({
    inputId: input.id,
    inputPath: inputPath,
    selectionMode: StreamSelectionMode.AUTO
  });
  
  const videoStream1 = await bitmovinApi.encoding.encodings.streams.create(
    encoding.id,
    new Stream({
      codecConfigId: videoCodecConfiguration1.id,
      inputStreams: [videoStreamInput1]
    })
  );

  console.log('Video stream 2...')
  
  const videoStreamInput2 = new StreamInput({
    inputId: input.id,
    inputPath: inputPath,
    selectionMode: StreamSelectionMode.AUTO
  });

  
  
  const videoStream2 = await bitmovinApi.encoding.encodings.streams.create(
    encoding.id,
    new Stream({
      codecConfigId: videoCodecConfiguration2.id,
      inputStreams: [videoStreamInput2]
    })
  );

  console.log('Video stream 3...')
  
  const videoStreamInput3 = new StreamInput({
    inputId: input.id,
    inputPath: inputPath,
    selectionMode: StreamSelectionMode.AUTO
  });
  
  const videoStream3 = await bitmovinApi.encoding.encodings.streams.create(
    encoding.id,
    new Stream({
      codecConfigId: videoCodecConfiguration3.id,
      inputStreams: [videoStreamInput3]
    })
  );

  console.log('Audio stream...')
  
  const audioStreamInput = new StreamInput({
    inputId: input.id,
    inputPath: inputPath,
    selectionMode: StreamSelectionMode.AUTO
  });
  
  const audioStream = await bitmovinApi.encoding.encodings.streams.create(
    encoding.id,
    new Stream({
      codecConfigId: audioCodecConfiguration.id,
      inputStreams: [audioStreamInput]
    })
  );
  
  const aclEntry = new AclEntry({
    permission: AclPermission.PUBLIC_READ
  });
  
  const segmentLength = 4;
  const outputPath = '/encoded';
  const segmentNaming = 'seg_%number%.m4s';
  const initSegmentName = 'init.mp4';

  console.log('Video muxing 1...')
  
  const videoMuxing1 = await bitmovinApi.encoding.encodings.muxings.fmp4.create(
    encoding.id,
    new Fmp4Muxing({
      segmentLength: segmentLength,
      segmentNaming: segmentNaming,
      initSegmentName: initSegmentName,
      streams: [new MuxingStream({streamId: videoStream1.id})],
      outputs: [
        new EncodingOutput({
          outputId: output.id,
          outputPath: outputPath + '/video/1024_1500000/fmp4/',
          acl: [aclEntry]
        })
      ]
    })
  );

  console.log('Video muxing 2...')
  
  const videoMuxing2 = await bitmovinApi.encoding.encodings.muxings.fmp4.create(
    encoding.id,
    new Fmp4Muxing({
      segmentLength: segmentLength,
      segmentNaming: segmentNaming,
      initSegmentName: initSegmentName,
      streams: [new MuxingStream({streamId: videoStream2.id})],
      outputs: [
        new EncodingOutput({
          outputId: output.id,
          outputPath: outputPath + '/video/768_1000000/fmp4/',
          acl: [aclEntry]
        })
      ]
    })
  );

  console.log('Video muxing 3...')
  
  const videoMuxing3 = await bitmovinApi.encoding.encodings.muxings.fmp4.create(
    encoding.id,
    new Fmp4Muxing({
      segmentLength: segmentLength,
      segmentNaming: segmentNaming,
      initSegmentName: initSegmentName,
      streams: [new MuxingStream({streamId: videoStream3.id})],
      outputs: [
        new EncodingOutput({
          outputId: output.id,
          outputPath: outputPath + '/video/640_750000/fmp4/',
          acl: [aclEntry]
        })
      ]
    })
  );

  console.log('Audio muxing 1...')
    
  const audioMuxing = await bitmovinApi.encoding.encodings.muxings.fmp4.create(
    encoding.id,
    new Fmp4Muxing({
      segmentLength: segmentLength,
      segmentNaming: segmentNaming,
      initSegmentName: initSegmentName,
      streams: [new MuxingStream({streamId: audioStream.id})],
      outputs: [
        new EncodingOutput({
          outputId: output.id,
          outputPath: outputPath + '/audio/128000/fmp4/',
          acl: [aclEntry]
        })
      ]
    })
);

/* Imaginary code block for each muxing

  CencDrm cencDrm = new CencDrm();
  cencDrm.addOutputsItem(encoding.id);
  cencDrm.setKey(<PUT_KEY_HERE>);
  cencDrm.setKid("SET_KID");
  CencWidevine widevineDrm = new CencWidevine();
  widevineDrm.setPssh("PSSH_KEY");
  cencDrm.setWidevine(widevineDrm);
  CencPlayReady playReadyDrm = new CencPlayReady();
  playReadyDrm.setLaUrl("http://playready.directtaps.net/pr/svc/rightsmanager.asmx");
  //playReadyDrm.setPssh("QWRvYmVhc2Rmc2FkZmFzZg==");
  cencDrm.setPlayReady(playReadyDrm);
  CencFairPlay cencFairPlay = new CencFairPlay();
  cencFairPlay.setIv("e7fada52ac654bbe80367505dceeb318");
  cencFairPlay.setUri("skd://userspecifc?custom=information");
  cencDrm.setFairPlay(cencFairPlay);

  bitmovinApi.encoding.encodings.muxings.fmp4.drm.cenc.create(encoding.id, muxing.id, cencDrm);
}

*/

  await bitmovinApi.encoding.encodings.start(encoding.id);

  const checkEncodingStatus = async () => {
    const status = await bitmovinApi.encoding.encodings.status(encoding.id);
    console.log(status.status)
    if (status.status === 'FINISHED'){
      await createManifest()
      clearInterval(checkStatus)
    }
  }

  const checkStatus = setInterval(checkEncodingStatus, 5000)


  const createManifest = async () => {

  const manifest = await bitmovinApi.encoding.manifests.dash.create(
  new DashManifest({
    name: 'Getting Started Manifest',
    manifestName: 'manifest.mpd',
    outputs: [
      new EncodingOutput({
        outputId: output.id,
        outputPath: outputPath,
        acl: [aclEntry]
      })]
    })
  );

  const period = await bitmovinApi.encoding.manifests.dash.periods.create(
    manifest.id,
    new Period()
  );

  const videoAdaptationSet = await bitmovinApi.encoding.manifests.dash.periods.adaptationsets.video.create(
    manifest.id,
    period.id,
    new VideoAdaptationSet()
  );

  const audioAdaptationSet = await bitmovinApi.encoding.manifests.dash.periods.adaptationsets.audio.create(
    manifest.id,
    period.id,
    new AudioAdaptationSet({
      lang: 'en'
    })
  );

  // Adding Audio Representation

  const audioRepresentation = await bitmovinApi.encoding.manifests.dash.periods.adaptationsets.representations.fmp4.create(
    manifest.id,
    period.id,
    audioAdaptationSet.id,
    new DashFmp4Representation({
      type: DashRepresentationType.TEMPLATE,
      encodingId: encoding.id,
      muxingId: audioMuxing.id,
      segmentPath: 'audio/128000/fmp4'
    })
  );

  // Adding Video Representation

  const videoRepresentation1 = await bitmovinApi.encoding.manifests.dash.periods.adaptationsets.representations.fmp4.create(
    manifest.id,
    period.id,
    videoAdaptationSet.id,
    new DashFmp4Representation({
      type: DashRepresentationType.TEMPLATE,
      encodingId: encoding.id,
      muxingId: videoMuxing1.id,
      segmentPath: 'video/1024_1500000/fmp4'
    })
  );

  // Adding Video Representation

  const videoRepresentation2 = await bitmovinApi.encoding.manifests.dash.periods.adaptationsets.representations.fmp4.create(
    manifest.id,
    period.id,
    videoAdaptationSet.id,
    new DashFmp4Representation({
      type: DashRepresentationType.TEMPLATE,
      encodingId: encoding.id,
      muxingId: videoMuxing2.id,
      segmentPath: 'video/768_1000000/fmp4'
    })
  );

  // Adding Video Representation

  const videoRepresentation3 = await bitmovinApi.encoding.manifests.dash.periods.adaptationsets.representations.fmp4.create(
    manifest.id,
    period.id,
    videoAdaptationSet.id,
    new DashFmp4Representation({
      type: DashRepresentationType.TEMPLATE,
      encodingId: encoding.id,
      muxingId: videoMuxing3.id,
      segmentPath: 'video/640_750000/fmp4'
    })
  );

  bitmovinApi.encoding.manifests.dash.start(manifest.id)
  console.log('done...')
  }
}

main()

// 3 things
// output.id not outputId
// link to documentation about output bucket
// mention you have to wait for encoding to finish before creating manifest
