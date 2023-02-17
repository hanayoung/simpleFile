/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import RNFS, { downloadFile } from 'react-native-fs';
import { Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {PERMISSIONS, request} from 'react-native-permissions';
function App(): JSX.Element {
  const getPermission=()=>{
    try {
      if(Platform.OS=='android'){
        if(Platform.Version>=33){
          console.log(Platform.Version);
          request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
          .then(granted =>{
            {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //Once user grant the permission start downloading
                console.log('Storage Permission Granted.');
                download();
              } else {
                console.log(granted);
                //If permission denied then show alert 'Storage Permission  Not Granted'
               Alert.alert('storage_permission is denied');
              }
            }
          })
        }else {
          console.log(Platform.Version,typeof(Platform.Version));
          request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
          .then(granted =>{
            {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //Once user grant the permission start downloading
                console.log('Storage Permission Granted.');
                download();
              } else {
                console.log(granted);
                //If permission denied then show alert 'Storage Permission  Not Granted'
               Alert.alert('storage_permission is denied');
              }
            }
          })
      }
      }else{
        console.log("ios not yet")
      }
      
      // PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //   {
      //     title:'storage title',
      //     message:'storage_permission',
      //     buttonNeutral: 'Ask Me Later',
      //     buttonNegative: 'Cancel',
      //     buttonPositive:'Yes',
      //   },
      // ).then(granted => {
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     //Once user grant the permission start downloading
      //     console.log('Storage Permission Granted.');
      //     download();
      //   } else {
      //     console.log(granted);
      //     //If permission denied then show alert 'Storage Permission  Not Granted'
      //    Alert.alert('storage_permission is denied');
      //   }
      // });
    } catch (err) {
      //To handle permission related issue
      console.log('error', err);
    }
  }
  const download=()=>{ //rn-fetch-blob 이용
    const { config, fs } = RNFetchBlob;
    const url="https://www.mathworksheets4kids.com/add-sub/3by2-1.pdf";
    let PictureDir = fs.dirs.DownloadDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/Report_Download' +
          Math.floor(date.getTime() + date.getSeconds() / 2),
        description: 'Risk Report Download',
      },
    };
    config(options)
      .fetch('GET', url)
      .then((res) => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        Alert.alert('Report Downloaded Successfully.');
      });
  }
  const downloadByFs=async()=>{ //react-native-fs 이용
    let date = new Date();
    await downloadFile({
      fromUrl:"https://www.mathworksheets4kids.com/add-sub/3by2-1.pdf",
      toFile:`${RNFS.DownloadDirectoryPath}/Report_Fs${Math.floor(date.getTime() + date.getSeconds() / 2)}.pdf`
    }).promise
  }

    const testFormData = async () => { //에러 발생 코드
      let date=new Date();
      let filename:string="DownloadFormData.pdf";
      let url:string="https://www.mathworksheets4kids.com/add-sub/3by2-1.pdf";
      const formData = new FormData();
      formData.append('filename', filename);
    
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        const blob = await response.blob();
        const localFilePath = await writeBlobToFile(blob,filename);
        return localFilePath;
      } catch (error) {
        console.error('Error downloading file', error);
      }
    };

    const writeBlobToFile = async (blob: Blob, filename: string) => { // 에러 발생 코드
      const mimeType = blob.type.split('/')[0]; 

      if (mimeType !== 'image' && mimeType !== 'audio' && mimeType !== 'video') {
        console.warn(`Unsupported MIME type: ${blob.type}`);
        return;
      }
      const uri = URL.createObjectURL(blob);
    
      try {
        const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
        await RNFS.writeFile(localFilePath, uri, 'uri');
        URL.revokeObjectURL(uri);
        return localFilePath;
      } catch (error) {
        console.error('Error writing blob to file', error);
      }
    };
  return(
<>
<TouchableOpacity onPress={getPermission}>
  <Text>Download</Text>
</TouchableOpacity>
<TouchableOpacity onPress={downloadByFs}>
<Text>Fs System</Text>
<TouchableOpacity onPress={testFormData}>
<Text>FormData</Text>
</TouchableOpacity>
</TouchableOpacity>
</>
  )
}


export default App;
