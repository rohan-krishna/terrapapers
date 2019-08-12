import React from 'react';
import { View, Text, FlatList } from 'react-native';

export default class WallpapersList extends React.PureComponent {
    
    render() {
        return (<FlatList 
            data={this.props.wallpapers}
            renderItem={this.props.renderWallpaperListItems}
            horizontal={true}
            pagingEnabled
            keyExtractor={item => item.id}
        />)
    }
}