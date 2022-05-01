import React, { useState } from 'react';
import { Flex, Grid, Text, Box, Wrap, WrapItem } from '@chakra-ui/react'

const Navbar = (props) =>
{

    return (
        <Flex justify="center" align="center" sx={{ minHeight: '10vh' }}>
            <Flex direction="column" align="center">
                <Wrap justify="start" p="20px">
                    <Text fontSize="2xl" color="black" fontWeight="bold">
                        Neoway validation
                    </Text>
                </Wrap>
            </Flex>
        </Flex>
    )

}

export default Navbar;