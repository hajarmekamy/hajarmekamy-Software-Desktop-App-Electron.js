# frozen_string_literal: true
require_relative 'sorbet/binding_constants_without_type_alias'
require_relative 'sorbet/constants_from_strings'
require_relative 'sorbet/forbid_superclass_const_literal'
require_relative 'sorbet/forbid_include_const_literal'
require_relative 'sorbet/forbid_untyped_struct_props'

require_relative 'sorbet/signatures/allow_incompatible_override'
require_relative 'sorbet/signatures/checked_true_in_signature'
require_relative 'sorbet/signatures/keyword_argument_ordering'
require_relative 'sorbet/signatures/parameters_ordering_in_signature'
require_relative 'sorbet/signatures/signature_build_order'
require_relative 'sorbet/signatures/enforce_signatures'

require_relative 'sorbet/sigils/valid_sigil'
require_relative 'sorbet/sigils/has_sigil'
require_relative 'sorbet/sigils/ignore_sigil'
require_relative 'sorbet/sigils/false_sigil'
require_relative 'sorbet/sigils/true_sigil'
require_relative 'sorbet/sigils/strict_sigil'
require_relative 'sorbet/sigils/strong_sigil'
require_relative 'sorbet/sigils/enforce_sigil_order'
