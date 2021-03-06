<?php
/**
 * Deactivator
 *
 * @since 1.0.0
 *
 * @package company_name\plugin_name
 */

namespace company_name\plugin_name;

// Abort if this file is called directly.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Deactivator.
 *
 * Runs when the plugin is deactivated.
 */
class Deactivator {

	/**
	 * Run Code.
	 *
	 * @since 1.0.0
	 */
	public function run() {
		register_deactivation_hook( COMPANY_NAME_PLUGIN_NAME_ROOT, array( $this, 'deactivate' ) );
	}

	/**
	 * Deactivate
	 *
	 * Runs code on deactivation.
	 *
	 * @since 1.0.0
	 */
	public function deactivate() {
		// Set a transient to confirm deactivation.
		set_transient( COMPANY_NAME_PLUGIN_NAME_PREFIX . '_activated', false );
	}
}
