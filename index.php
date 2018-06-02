<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>Hello Git</title>
</head>
<body>
	<h1>Hello GitHub</h1>
	<?php
		function print_array($arr, $pre = ''){
			echo "<ul>\n";
			foreach($arr as $k => $v){
				if(is_array($v)){
					echo '<li>'.$pre.htmlentities($k).":</li>\n";
					print_array($v);
				} else {
					echo '<li>'.htmlentities($k).' => '.htmlentities($v)."</li>\n";
				}
			}
			echo "</ul>\n";
		}

		$test = [
			0 => [
				'question' => 'Вопрос 1?',
				'answers' => [
					0 => 'Правильный вариант ответа на вопрос 1!',
					1 => 'Не правильный вариант ответа на вопрос 1!(1)',
					2 => 'Не правильный вариант ответа на вопрос 1!(2)',
					3 => 'Не правильный вариант ответа на вопрос 1!(3)',
				],
			],
			1 => [
				'question' => 'Вопрос 2?',
				'answers' => [
					0 => 'Правильный вариант ответа на вопрос 2!',
					1 => 'Не правильный вариант ответа на вопрос 2!(1)',
					2 => 'Не правильный вариант ответа на вопрос 2!(2)',
					3 => 'Не правильный вариант ответа на вопрос 2!(3)',
				],
			],
			2 => [
				'question' => 'Вопрос 3?',
				'answers' => [
					0 => 'Правильный вариант ответа на вопрос 3!',
					1 => 'Не правильный вариант ответа на вопрос 3!(1)',
					2 => 'Не правильный вариант ответа на вопрос 3!(2)',
					3 => 'Не правильный вариант ответа на вопрос 3!(3)',
				],
			],
			3 => [
				'question' => 'Вопрос 4?',
				'answers' => [
					0 => 'Правильный вариант ответа на вопрос 4!',
					1 => 'Не правильный вариант ответа на вопрос 4!(1)',
					2 => 'Не правильный вариант ответа на вопрос 4!(2)',
					3 => 'Не правильный вариант ответа на вопрос 4!(3)',
				],
			],
			4 => [
				'question' => 'Вопрос 5?',
				'answers' => [
					0 => 'Правильный вариант ответа на вопрос 5!',
					1 => 'Не правильный вариант ответа на вопрос 5!(1)',
					2 => 'Не правильный вариант ответа на вопрос 5!(2)',
					3 => 'Не правильный вариант ответа на вопрос 5!(3)',
				],
			],
		];

		class TestHundler{
			private $test;

			public function __construct(array $test){
				if($this->checkingAnArray($test)){
					$this->test = $test;
				} else {
					print "Что то пошло не так";
				}
			}

			public function checkingAnArray(array $test){
				for($i = 0; $i < count($test); $i++){
					if( !(
						array_key_exists('question', $test[$i])
						&& array_key_exists('answers', $test[$i])
						&& count($test[$i]['answers']) == 4
						)
					){
						return false;
					}
				}
				return true;
			}

			public function formQuestions(){
				$questions = array();
				for($i = 0; $i < count($this->test); $i++){
					$question[] = $this->test[$i]['question'];
				}
				return $questions;
			}

			private function formShuffle(){
				$arr = range(0, 3);
				shuffle($arr);
				return $arr;
			}

			public function printTest(){
				$html = "\n<form method='GET'>\n";
				for($i = 0; $i < count($this->test); $i++){
					$rand = $this->formShuffle();
					$html .= "<h3>{$this->test[$i]['question']}</h3>\n";
					for($j = 0; $j < count($rand); $j++){
						$html .= "
							<input type='radio' name='test[$i]' value=\"$rand[$j]\" id=\"ans$i($rand[$j])\"><label for=\"ans$i($rand[$j])\">".$this->test[$i]['answers'][$rand[$j]]."</label><br>\n
						";
					}
					$html .= "<br>";
				}	
				$html .= "<input type='submit'>\n</form>\n";
				print $html;
			}

			public function checkAnswer(array $answer){
				$array_output = array();
				for($i = 0; $i < count($this->test); $i++){
					if($answer[$i] == 0){
						$array_output[$this->test[$i]['question']] = '<p style="color: green">Ваш ответ: '.$this->test[$i]['answers'][$answer[$i]].' верно!</p><br>';
					} else {
						$array_output[$this->test[$i]['question']] = '<p style="color: red">Ваш ответ: '.$this->test[$i]['answers'][$answer[$i]].' неверно! Правильный ответ: '.$this->test[$i]['answer'].'</p><br>';
					}
				}
				return $array_output;
			}
		}

		$t = new TestHundler($test);

		if(isset($_GET['test'])){
			foreach($t->checkAnswer($_GET['test']) as $k => $v){
				echo "<h3>$k</h3>$v";
			}
		} else {
			$t->printTest();
		}
	?>
</body>
</html>