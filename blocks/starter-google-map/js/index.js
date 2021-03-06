/**
 * Block.
 * 
 * This is where we define our block.
 */

/**
 * Import Assets.
 * 
 * With webpack, we import the SCSS into the JS so that it can be parsed.
 * Dont worry, these will be compiled into their respective CSS files.
 */
import '../scss/blockEditor.scss'; // Block editor styles
import '../scss/block.scss';       // Block styles

/**
 * Block Dependencies.
 */

// From Block
import attributes from './attributes';                    // Attribute Registration
import initMap from './map-init';                         // Initiate Google Maps
import Inspector from './inspector';                      // InspectorControls (Sidebar)
import store from '../../data/rest-api-options/js/index'; // REST API Endpoints.

// Imported from WordPress
import classnames from 'classnames'; // Enables us to concat classnames

// Internal Block Libraries
const { registerBlockType } = wp.blocks;
const { ResizableBox }      = wp.components;
const { compose }           = wp.compose;
const { 
	withDispatch, 
	withSelect 
}                           = wp.data;
const { Fragment }          = wp.element;
const { __ }                = wp.i18n; // Localization

/**
 * With Dispatch
 * 
 * Save values to the API.
 */
const applyWithDispatch = withDispatch( ( dispatch, { value } ) => {
	return {
		updateOption( value ) {
			dispatch( 'company-name/plugin-name' ).updateOption( value );
		},
	};
} );


/**
 * With Select
 * 
 * Get values from the API.
 */
const applyWithSelect = withSelect( ( select ) => {
	return {
		gMapEmbedAPIKeyOption: select( 'company-name/plugin-name' ).receiveOption( 'gMapEmbedAPIKey' ),
	};
} );

/**
 * Register Block
 */
export default registerBlockType( 'plugin-name/starter-google-map', {

	// Set the title.
	title: __( 'Starter Google Map', 'plugin-name' ),

	// Set the description.
	description: __( 'Display a responsive Google Map in your content, complete with a handful of configuration options.', 'plugin-name' ),
	
	// Select a category.
	category: 'starter-blocks', // Custom (see ./index.php)
	// category:   'common',
	// category:   'embed',
	// category:   'formatting',
	// category:   'layout',
	// category:   'widgets',

	// Set the icon.
	icon: {
		background: '#2cc795',    // Icon custom background colour
		foreground: '#fff',       // Icon custom forground colour
		src: 'location-alt' // WordPress Dashicon reference (we can pass an svg for custom icon)
	},
	keywords:[
		__( 'Google Maps Embed' ),
		__( 'Google Maps' ),
		__( 'Google' ),
	],

	// Supports options
	// https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-registration/#supports-optional
	supports: {
		align: [ 'full', 'wide' ],
		// anchor: true,
		// html: false,
		// multiple: true,
		// reusable: true,
	},

	// Allow component to be used once only.
	// useOnce: true,

	// Import the attributes
	attributes,

	/**
	 * Edit
	 * 
	 * Using 'compose' to combine our withSelect and withDispatch, there is now a wrapper around
	 * the rest of the edit function.
	 */
	edit: compose(
		[
			applyWithDispatch,
			applyWithSelect,
		]
	)( props => {

		/**
		 * Extract Props
		 * 
		 * We could access props by typing props.attributes.name, or props.name.
		 * However setting them up here gives us an easy reference of what we can
		 * use in our component.
		 */
		const {
			attributes: {
				gMapEmbedAPIKey,
				gMapEmbedID,
				gMapEmbedLocation,
				height,
			},
			className,
			gMapEmbedAPIKeyOption,
			setAttributes, 
			isSelected,
			toggleSelection,
			updateOption,
		} = props;

		/**
		 * Functions.
		 * 
		 * Functions for this Component.
		 */

		if ( ! gMapEmbedID ) {
			let ts = Math.round((new Date()).getTime() / 1000);
			let id = 'starter-google-map--' + ts;
			setAttributes( { gMapEmbedID: id } );
		}

		if ( ! gMapEmbedAPIKey && gMapEmbedAPIKeyOption && 'string' == typeof gMapEmbedAPIKeyOption ) {
			setAttributes( { gMapEmbedAPIKey: gMapEmbedAPIKeyOption } );
		}
		
		// Bind our Google Maps API callback to the window, which lets us call initMap.
		window.initGoogleMapEmbed = function() {
			initMap( props.attributes );
		};

		/**
		 * Return 
		 * 
		 * Here is where we return our JSX. Note that we are returning an array.
		 * We are passing in:
		 * 
		 * - InspectorControls
		 * - Edit View
		 * 
		 * Note how we pass props to our custom components.
		 */
		return [
			<Inspector { ...{ setAttributes, ...props, updateOption, gMapEmbedAPIKeyOption } }/>,
			<ResizableBox
			className={ classnames( 
				className,
				'starter-google-map__wrapper',
				{ 'is-selected': isSelected }
			) }
				size={ {
					height,
				} }
				minHeight="20"
				enable={ {
					top: false,
					right: false,
					bottom: true,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				} }
				onResizeStop={ ( event, direction, elt, delta ) => {
					setAttributes( {
						height: parseInt( height + delta.height, 10 ),
					} );
					toggleSelection( true );
				} }
				onResizeStart={ () => {
					toggleSelection( false );
				} }
			>
				<div
					id={ gMapEmbedID }
					className={ classnames( 
						className,
						'starter-google-map',
						gMapEmbedAPIKey && gMapEmbedLocation ? 'has-api-key' : 'no-api-key',
					) }
				>
					{ gMapEmbedAPIKey && gMapEmbedLocation ? (
						<Fragment>
							{ setTimeout( function() { initMap( props.attributes ) }, 500 ) }
						</Fragment>
					) : (
						<p>
							{ __( 'Please enter your API Key and Location in the sidebar to render the map.', 'plugin-name' ) }
						</p>
					) }
				</div>
			</ResizableBox>
		];
	} ),

	/**
	 * Save
	 * 
	 * It is possible to render the save view in PHP. We are not in this example though.
	 * 
	 * We pass in the props we need for output. Which should not be as many as in the 
	 * Edit View.  
	 */
	save: props => {

		const {
			attributes: {
				gMapEmbedAddressCompanyName,
				gMapEmbedAddressCountry,
				gMapEmbedAddressLine1,
				gMapEmbedAddressLine2,
				gMapEmbedAddressLocality,
				gMapEmbedAddressPostOfficeBox,
				gMapEmbedAddressRegion,
				gMapEmbedAddressPostCode,
				gMapEmbedAPIKey,
				gMapEmbedDisableUI,
				gMapEmbedID,
				gMapEmbedInfoWindowContent,
				gMapEmbedInfoWindowImageAlt,
				gMapEmbedInfoWindowImageID,
				gMapEmbedInfoWindowImageURL,
				gMapEmbedInfoWindowLinkText,
				gMapEmbedInfoWindowLinkURL,
				gMapEmbedInfoWindowShowAddress,
				gMapEmbedInfoWindowTitle,
				gMapEmbedMarker,
				gMapEmbedMarkerID,
				gMapEmbedLat,
				gMapEmbedLocation,
				gMapEmbedLong,
				gMapEmbedStyles,
				gMapEmbedType,
				gMapEmbedZoom,
				height,
			},
			className, 
		} = props;
	
		/**
		 * Return 
		 * 
		 * For the most part this should be plain HTML with a few
		 * { variables } scattered around.
		 * 
		 * Microformats
		 * 
		 * Note that we are using the following microformats:
		 * 
		 * - h-geo: http://microformats.org/wiki/h-entry
		 * - geo: http://microformats.org/wiki/hentry
		 * 
		 * As this is a map, in theory we could use https://schema.org/Map
		 * but that is more appropriate when linking to a Map.
		 */
		return (
			<div
				className={ classnames( 
					'starter-google-map__wrapper',
					( ! gMapEmbedInfoWindowShowAddress ) ? 'geo' : '',
					( ! gMapEmbedInfoWindowShowAddress ) ? 'h-geo' : '',
				) }
			>
				<div
					id={ gMapEmbedID }
					className={ classnames( 
						'starter-google-map',
						gMapEmbedAPIKey && gMapEmbedLocation ? 'has-api-key' : 'no-api-key',
						
					) }
					style={ { height: height } }
				>
					<form class="starter-google-map__attributes">
						<input type="hidden" name="gMapEmbedAddressCompanyName" value={ gMapEmbedAddressCompanyName } />
						<input type="hidden" name="gMapEmbedAddressCountry" value={ gMapEmbedAddressCountry } />
						<input type="hidden" name="gMapEmbedAddressLine1" value={ gMapEmbedAddressLine1 } />
						<input type="hidden" name="gMapEmbedAddressLine2" value={ gMapEmbedAddressLine2 } />
						<input type="hidden" name="gMapEmbedAddressLocality" value={ gMapEmbedAddressLocality } />
						<input type="hidden" name="gMapEmbedAddressPostOfficeBox" value={ gMapEmbedAddressPostOfficeBox } />
						<input type="hidden" name="gMapEmbedAddressRegion" value={ gMapEmbedAddressRegion } />
						<input type="hidden" name="gMapEmbedAddressPostCode" value={ gMapEmbedAddressPostCode } />
                        <input type="hidden" name="gMapEmbedAPIKey" value={ gMapEmbedAPIKey } />
                        <input type="hidden" name="gMapEmbedDisableUI" value={ gMapEmbedDisableUI ? 'true' : 'false' } />
                        <input type="hidden" name="gMapEmbedInfoWindowContent" value={ gMapEmbedInfoWindowContent } />
						<input type="hidden" name="gMapEmbedInfoWindowImageAlt" value={ gMapEmbedInfoWindowImageAlt } />
						<input type="hidden" name="gMapEmbedInfoWindowImageID" value={ gMapEmbedInfoWindowImageID } />
						<input type="hidden" name="gMapEmbedInfoWindowImageURL" value={ gMapEmbedInfoWindowImageURL } />
						<input type="hidden" name="gMapEmbedInfoWindowLinkText" value={ gMapEmbedInfoWindowLinkText } />
						<input type="hidden" name="gMapEmbedInfoWindowLinkURL" value={ gMapEmbedInfoWindowLinkURL } />
						<input type="hidden" name="gMapEmbedInfoWindowShowAddress" value={ gMapEmbedInfoWindowShowAddress ? 'true' : 'false' } />
						<input type="hidden" name="gMapEmbedInfoWindowTitle" value={ gMapEmbedInfoWindowTitle } />
                        <input type="hidden" name="gMapEmbedLat" value={ gMapEmbedLat } class="p-latitude latitude" />
						<input type="hidden" name="gMapEmbedLocation" value={ gMapEmbedLocation } />
						<input type="hidden" name="gMapEmbedLong" value={ gMapEmbedLong } class="p-longitude longitude" />
						<input type="hidden" name="gMapEmbedMarker" value={ gMapEmbedMarker } />
                        <input type="hidden" name="gMapEmbedMarkerID" value={ gMapEmbedMarkerID } />
						<input type="hidden" name="gMapEmbedStyles" value={ gMapEmbedStyles } />
						<input type="hidden" name="gMapEmbedType" value={ gMapEmbedType } />
						<input type="hidden" name="gMapEmbedZoom" value={ gMapEmbedZoom } />
					</form>
				</div>
				{ ( ! gMapEmbedInfoWindowShowAddress ) &&
					<Fragment>
						<data class="p-latitude latitude" value={ gMapEmbedLat } />
						<data class="p-longitude longitude" value={ gMapEmbedLong } />
					</Fragment>
				}
			</div>
		);
	},
} );
