/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import { Box, Card, CardHeader, Grid, Skeleton } from '@mui/material';
import React, { Component } from 'react';

export default function TrackSkeleton() {
    return ( <Box sx={{maxWidth: '768px', width: '100%', mb: 2}}>
    <Grid xs={12}>
        <Card sx={{ width: '100%', m: 2 }}>
            <CardHeader
            avatar={
                <Skeleton animation="wave" variant="circle" width={80} height={80} />
            }
            action={
                null
            }
            title={
                <Skeleton
                    animation="wave"
                    height={40}
                    width="80%"
                    style={{ marginBottom: 6 }}
                />
            }
            subheader={
                <Skeleton animation="wave" height={20} width="40%" />
            }
            />
    </Card>
    </Grid>
</Box>)
}
