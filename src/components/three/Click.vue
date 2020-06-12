<template>

</template>

<script>
    import * as Three from 'three'
    export default {
        name: "Click",
        data() {
            return {
                camera:null,
                scene:null,
                renderer:null,
                plane:null,
                mouse:null,
                raycaster:null,
                isShiftDown:false,
                rollOverMesh:null,
                rollOverMaterial:null,
                cubeGeo:null,
                cubeMaterial:null,
                objects:[]
            }
        },
        methods:{
            init:function () {
                this.camera = new Three.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
                this.camera.position.set( 500, 800, 1300 );
                this.camera.lookAt( 0, 0, 0 );
                this.scene = new Three.Scene();
                this.scene.background = new Three.Color( 0xf0f0f0 );
                // roll-over helpers
                let rollOverGeo = new Three.BoxBufferGeometry( 50, 50, 50 );
                this.rollOverMaterial = new Three.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
                this.rollOverMesh = new Three.Mesh( rollOverGeo, this.rollOverMaterial );
                this.scene.add( this.rollOverMesh );
                // cubes
                this.cubeGeo = new Three.BoxBufferGeometry( 50, 50, 50 );
                this.cubeMaterial = new Three.MeshLambertMaterial( { color: 0xfeb74c, map: new Three.TextureLoader().load( 'textures/square-outline-textured.png' ) } );
                // grid
                let gridHelper = new Three.GridHelper( 1000, 20 );
                this.scene.add( gridHelper );
                //
                this.raycaster = new Three.Raycaster();
                this.mouse = new Three.Vector2();
                let geometry = new Three.PlaneBufferGeometry( 1000, 1000 );
                geometry.rotateX( - Math.PI / 2 );
                this.plane = new Three.Mesh( geometry, new Three.MeshBasicMaterial( { visible: false } ) );
                this.scene.add( this.plane );
                this.objects.push( this.plane );
                // lights
                let ambientLight = new Three.AmbientLight( 0x606060 );
                this.scene.add( ambientLight );
                let directionalLight = new Three.DirectionalLight( 0xffffff );
                directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
                this.scene.add( directionalLight );
                this.renderer = new Three.WebGLRenderer( { antialias: true } );
                this.renderer.setPixelRatio( window.devicePixelRatio );
                this.renderer.setSize( window.innerWidth, window.innerHeight );
                document.body.appendChild( this.renderer.domElement );
                document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
                document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
                document.addEventListener( 'keydown', this.onDocumentKeyDown, false );
                document.addEventListener( 'keyup', this.onDocumentKeyUp, false );
                //
                window.addEventListener( 'resize', this.onWindowResize, false );
            },
            onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( window.innerWidth, window.innerHeight );
            },
            onDocumentMouseMove( event ) {
                event.preventDefault();
                this.mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
                this.raycaster.setFromCamera( this.mouse, this.camera );
                let intersects = this.raycaster.intersectObjects( this.objects );
                if ( intersects.length > 0 ) {
                    let intersect = intersects[ 0 ];
                    this.rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
                    this.rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
                }
                this.render();
            },
            onDocumentMouseDown( event ) {
                event.preventDefault();
                this.mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
                this.raycaster.setFromCamera( this.mouse, this.camera );
                let intersects = this.raycaster.intersectObjects( this.objects );
                if ( intersects.length > 0 ) {
                    let intersect = intersects[ 0 ];
                    // delete cube
                    if ( this.isShiftDown ) {
                        if ( intersect.object !== this.plane ) {
                            this.scene.remove( intersect.object );
                            this.objects.splice( this.objects.indexOf( intersect.object ), 1 );
                        }
                        // create cube
                    } else {
                        let voxel = new Three.Mesh( this.cubeGeo, this.cubeMaterial );
                        voxel.position.copy( intersect.point ).add( intersect.face.normal );
                        voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
                        this.scene.add( voxel );
                        this.objects.push( voxel );
                    }
                    this.render();
                }
            },
            onDocumentKeyDown( event ) {
                switch ( event.keyCode ) {
                    case 16: this.isShiftDown = true; break;
                }
            },
            onDocumentKeyUp( event ) {
                switch ( event.keyCode ) {
                    case 16: this.isShiftDown = false; break;
                }
            },
            render() {
                this.renderer.render( this.scene, this.camera );
            }
        },
        mounted() {
            this.init();
            this.render();
        }
    }
</script>

<style scoped>

</style>
