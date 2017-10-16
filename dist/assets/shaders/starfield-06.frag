Shader Inputs
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

void mainImage( out vec4 F, in vec2 C )
{
    F *= 0.; // ios fix 
    
    // on mac, loop below runs only once! bug
    
    for (float i = 1.; i < 6.; i++)
        F += floor(
            	fract(
                    sin(
                        dot(
                            mod(
                                ceil(
            						C.xy / iResolution.xy * (400. - i *29.) 
                                    	+ vec2(
                                	    	iTime * (10. + i * 9.),
                							i * 10.
                            	    	)
	    						)
                            	,150.
                            ), 
                        	vec2(i + 127.1, 311.7)
                        )
                    ) * 43758.5453
                ) + .001                                              
        	) / (6. - i);
    }


/**
 *
 * My chrome extension for Shadertoy:
 * 
 * http://bit.ly/shadertoy-plugin 
 * 
 */