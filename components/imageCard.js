import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import {Image} from 'expo-image'
import { getImageSize, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { router } from 'expo-router'


const ImageCard = ({item,index,columns,router}) => {
     
    const isLastInRow = ()=>{
        return (index+1)% columns===0;
    }


     const getImageHeight = ()=>{
        let {imageHeight:height,imageWidth:width} = item;
        return {height : getImageSize(height, width)}; 
    }
    return (
    <Pressable onPress={()=>router.push({pathname:'home/image',params : {...item}})}  
    style={[styles.imageWrapper,!isLastInRow() && styles.spacing]}>
        <Image
        style={[styles.image, getImageHeight()]}
        source={item?.webformatURL}
        transition={100}
      />
    </Pressable>
  )
}

const styles= StyleSheet.create({
    image:{
        height: 300,
        width:'100',
    },
    imageWrapper:{
        backgroundColor: theme.colors.grayBG,
        borderRadius:theme.radius.xl,
        overflow: 'hidden',
        borderCurve: 'continuous',
        marginBottom: wp(2)
    },
    spacing: {
        marginRight: wp(2)
    }
})


export default ImageCard