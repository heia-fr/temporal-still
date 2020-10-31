import 'angular';

import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;

import './models/helpers/Symbols';
import './models/helpers/Util';
import './app/app';

import mountJQuery from 'perfect-scrollbar/jquery';
mountJQuery($);

import 'bootstrap';
import 'angular-local-storage';
import 'angular-route';
import 'd3';
import 'nvd3';
import 'angularjs-nvd3-directives';
import 'lodash';

import './app/components/home.component';
import './app/components/howto.component';
import './app/components/about.component';
import './app/services/services';
import './app/directives/eventsDirectives';
import './app/directives/validationDirectives';
import './app/filters/formattingFilters';

import './models/analysers/Lexer';
import './models/helpers/Extend';
import './models/analysers/BooleanSignalLexer';
import './models/analysers/TemporalFormulaLexer';
import './models/analysers/BooleanSignalSyntaxDiagram';
import './models/analysers/TemporalFormulaSyntaxDiagram';
import './models/operators/Operator';
import './models/operators/TemporalOperator';
import './models/operators/And';
import './models/operators/Or';
import './models/operators/Implies';
import './models/operators/Not';
import './models/operators/Always';
import './models/operators/Eventually';
import './models/operators/WeakUntil';
import './models/analysers/TemporalFormulaInterpreter';
import './models/business/Map';
import './models/business/Universe';
import './models/business/FormulasManager';
import './models/entities/BooleanSignal';
import './models/entities/TemporalFormula';
import './models/generators/BooleanSignalGenerator';
import './models/generators/FormulaGenerator';
