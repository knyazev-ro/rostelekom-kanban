<?php

namespace App\Console\Commands;

use App\Services\ParseHandbook;
use Illuminate\Console\Command;

class ParseExcelSheets extends Command
{
    public function __construct(protected ParseHandbook $parseHandbook) {
        parent::__construct();
    }
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:parse-excel-sheets {path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // C:\Users\knz\Downloads\Telegram Desktop\Кейс_РТК_Хакатон_Справочники_Фактура.xlsx
        $path = $this->argument('path') ?? null;
        if(is_null($path)) {
            $this->error('Path argument is required.');
            return;
        }
        $this->parseHandbook->parse($path);
    }
}
