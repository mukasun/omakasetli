import React, { useState, useRef, ChangeEvent } from 'react'
import styles from '@/styles/components/Loader.module.scss'
import { useFirebase } from '@/libs/firebase/hook'
import { Stack, Avatar } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'

type Props = {
  uid: string
  src: string
  onUpload: (url: string) => void
}

export const AvatarUploader: React.FC<Props> = (props) => {
  const inputFile = useRef(null)
  const firebase = useFirebase()
  // const [uploadingProcess, setUploadingProgress] = useState(100)
  const [isUploading, setIsUploading] = useState(false)

  const onClickInputFile = () => {
    inputFile.current.click()
  }

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files[0]
    if (!imageFile) return
    const uploadTask = firebase.storage.ref(`users/${props.uid}/thumbnail`).put(imageFile)

    setIsUploading(true)
    uploadTask.on(
      firebase.storageTaskEvent.STATE_CHANGED,
      () => {
        // const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // setUploadingProgress(percent)
      },
      (error) => {
        console.log(error)
        setIsUploading(false)
      },
      () => {
        uploadTask.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            props.onUpload(url)
            setIsUploading(false)
          })
        })
      }
    )
  }
  return (
    <Stack align="center">
      <input
        type="file"
        accept="image/png,image/jpeg,image/gif"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={onSelectFile}
      />
      <Avatar
        src={props.src}
        size="xl"
        showBorder
        borderColor="#eee"
        onClick={onClickInputFile}
        style={{ cursor: 'pointer' }}
      />
      <div className={styles.fileUploadLink} onClick={onClickInputFile}>
        <RepeatIcon />
        &nbsp;
        {isUploading ? 'Uploading...' : 'Change'}
      </div>
    </Stack>
  )
}
