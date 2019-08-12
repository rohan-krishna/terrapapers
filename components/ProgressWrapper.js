import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default class ProgressWrapper extends React.PureComponent {
    render() {
        if (this.props.isLoading) {
            return (
                <View style={{ width: this.props.width, height: this.props.height, justifyContent: "center", backgroundColor:"black" }}>
                    <ActivityIndicator color="grey" style={{ alignContent: "center" }} />
                </View>
            )
        } else {
            return (
                <View />
            )
        }
    }
}